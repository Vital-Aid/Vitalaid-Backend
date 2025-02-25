import axios from "axios";
import { Request, Response, NextFunction } from "express";
import MedHistory from "../../Models/Medicalhistory";
import CustomError from "../../utils/CustomError";
import { error } from "console";

export const generateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userid,
      name,
      age,
      height,
      weight,
      pressureRate,
      sugarRate,
      cholesterol,
      allergies,
      otherDiseases,
      aboutYou,
    } = req.body;

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
      return next(new CustomError("GEMINI_API_KEY is not configured", 400));
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const candidates = response.data?.candidates;
    if (!candidates || candidates.length === 0) {
      throw new CustomError("No candidates found in Gemini API response", 500);
    }

    const reportText = candidates[0]?.content?.parts?.[0]?.text;
    const normalText = reportText.replace(/\*\*/g, "");
    const healthStatusMatch = reportText.match(/Health Status:\s*(?:Categorize as:)?\s*\n?-?\s*\*\*(.*?)\*\*/i);

    
    const healthStatus = healthStatusMatch ? healthStatusMatch[1] : "Unknown";

  
    if (!reportText) {
      throw new CustomError(
        "Report text not found in Gemini API response",
        500
      );
    }

    const newhistory = new MedHistory({
      User: userid,
      report: normalText,
      healthstatus:healthStatus
    });

    await newhistory.save();

    res.status(200).json({ success: true, report: newhistory });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return next(
        new CustomError(
          error.response?.data?.error?.message || "API request failed",
          error.response?.status || 500
        )
      );
    }
    next(error);
  }
};


export const getReportbyid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reports = await MedHistory.find({ User: req.params.id });
  if (!reports) {
    return next(new CustomError("any reports found for this user"));
  }
  res.status(200).json(reports);
};
