"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportbyid = exports.generateReport = void 0;
const axios_1 = __importDefault(require("axios"));
const Medicalhistory_1 = __importDefault(require("../../Models/Medicalhistory"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const generateReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const { userid, name, age, height, weight, pressureRate, sugarRate, cholesterol, allergies, otherDiseases, aboutYou, } = req.body;
        const prompt = `
    Generate a structured medical report based on the following patient details:
    
    ## **Patient Information**
    - **Patient Name:** ${name}
    - **Date:** ${new Date().toISOString().split("T")[0]}
    - **Age:** ${age} years
    - **Height:** ${height} cm
    - **Weight:** ${weight} kg
    - **Blood Pressure:** ${pressureRate || "Not provided"} mmHg
    - **Blood Sugar Level:** ${sugarRate || "Not provided"} mg/dL
    - **Cholesterol Level:** ${cholesterol || "Not provided"} mg/dL
    - **Allergies:** ${allergies || "None reported"}
    - **Medical History:** ${otherDiseases || "None reported"}
    - **Additional Notes:** ${aboutYou || "No additional details"}
    
    ## **Health Assessment**
    1. **Anthropometric Analysis:** Evaluate height, weight, and BMI.
    2. **Vital Signs Assessment:** Analyze blood pressure and sugar levels.
    3. **Metabolic Health:** Review cholesterol levels and metabolic parameters.
    4. **Allergy Considerations:** Identify potential risks and precautions.
    5. **Medical History Review:** Consider past conditions and their impact.
    
    ## **Key Health Concerns**
    - Highlight potential health risks based on patient's age and recorded health metrics.
    
    ## **Recommendations**
    - Provide lifestyle, dietary, and medical test suggestions if needed.
    
    ## **Final Health Evaluation**
    - **Health Score:** Rate overall health on a scale of 1 to 10 based on findings.
    - **Health Status:** Categorize as:
      - **Healthy** 🟢  
      - **Needs Monitoring** 🟡  
      - **At Risk** 🔴  
      - **Requires Immediate Attention** ⚠️
    `;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return next(new CustomError_1.default("GEMINI_API_KEY is not configured", 400));
        }
        const response = yield axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, { contents: [{ parts: [{ text: prompt }] }] }, { headers: { "Content-Type": "application/json" } });
        const candidates = (_a = response.data) === null || _a === void 0 ? void 0 : _a.candidates;
        if (!candidates || candidates.length === 0) {
            throw new CustomError_1.default("No candidates found in Gemini API response", 500);
        }
        const reportText = (_e = (_d = (_c = (_b = candidates[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text;
        const normalText = reportText.replace(/\*\*/g, "");
        const healthStatusMatch = reportText.match(/Health Status:\s*(?:Categorize as:)?\s*\n?-?\s*\*\*(.*?)\*\*/i);
        const healthStatus = healthStatusMatch ? healthStatusMatch[1] : "Unknown";
        if (!reportText) {
            throw new CustomError_1.default("Report text not found in Gemini API response", 500);
        }
        const newhistory = new Medicalhistory_1.default({
            User: userid,
            report: normalText,
            healthstatus: healthStatus
        });
        yield newhistory.save();
        res.status(200).json({ success: true, report: newhistory });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            return next(new CustomError_1.default(((_h = (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.message) || "API request failed", ((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) || 500));
        }
        next(error);
    }
});
exports.generateReport = generateReport;
const getReportbyid = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield Medicalhistory_1.default.find({ User: req.params.id });
    if (!reports) {
        return next(new CustomError_1.default("any reports found for this user"));
    }
    res.status(200).json(reports);
});
exports.getReportbyid = getReportbyid;
