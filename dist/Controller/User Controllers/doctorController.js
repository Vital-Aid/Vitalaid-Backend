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
exports.addTokenPerDay = exports.searchDoctors = exports.editAvailability = exports.editTokenStatus = exports.getallTokensofEachDoctor = exports.getallTokens = exports.getDoctersByIdfordoctor = exports.getDoctersById = exports.getDoctors = void 0;
const Doctor_1 = __importDefault(require("../../Models/Doctor"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const DoctorDetails_1 = __importDefault(require("../../Models/DoctorDetails"));
const token_1 = __importDefault(require("../../Models/token"));
const totalToken_1 = __importDefault(require("../../Models/totalToken"));
const getDoctors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalDoctors = yield Doctor_1.default.countDocuments({ isDeleted: false });
    const doctors = yield Doctor_1.default.find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);
    if (!doctors.length) {
        return next(new CustomError_1.default("No doctors found", 404));
    }
    res.status(200).json({
        status: 200,
        message: "Doctors Data",
        data: doctors,
        totalPages: Math.ceil(totalDoctors / limit),
        currentPage: page,
        totalDoctors
    });
});
exports.getDoctors = getDoctors;
const getDoctersById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doctor = yield Doctor_1.default.findById(id);
    if (!doctor) {
        return next(new CustomError_1.default('Docter not found', 404));
    }
    res.status(200).json({ status: true, message: "docur by id", data: doctor });
});
exports.getDoctersById = getDoctersById;
const getDoctersByIdfordoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const doctor = yield DoctorDetails_1.default.findOne({ doctor: id }).populate('doctor', 'name email phone ');
    if (!doctor) {
        return next(new CustomError_1.default('Docter not found', 404));
    }
    res.status(200).json({
        status: true,
        message: "dr data",
        data: doctor,
    });
});
exports.getDoctersByIdfordoctor = getDoctersByIdfordoctor;
const getallTokens = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tokens = yield token_1.default.find({ doctorId: id, isVerified: true }).populate("patientId", "name email phone");
    if (!tokens) {
        return next(new CustomError_1.default('tokens not available'));
    }
    res.status(200).json({ status: true, message: 'all tokens', data: tokens });
});
exports.getallTokens = getallTokens;
const getallTokensofEachDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        res.status(401).json({ status: false, message: "Unauthorized access" });
        return;
    }
    const doctorId = req.user.id;
    const { date } = req.query;
    if (!date) {
        res.status(400).json({ status: false, message: "Date is required" });
        return;
    }
    const tokens = yield token_1.default.find({
        doctorId,
        date,
        isVerified: true,
    }).populate("patientId", "name email phone profileImage").lean().exec();
    if (!tokens || tokens.length === 0) {
        res.status(404).json({ status: false, message: "No tokens found" });
        return;
    }
    res.status(200).json({ status: true, message: "All tokens", data: tokens });
});
exports.getallTokensofEachDoctor = getallTokensofEachDoctor;
const editTokenStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('jsdvchgs');
    const { status } = req.body;
    const { id } = req.params;
    console.log("id", id);
    console.log(status);
    const updateToken = yield token_1.default.findByIdAndUpdate(id, { status: status }, { new: true });
    res.status(200).json({ status: true, message: 'token status updated successfully', data: updateToken });
});
exports.editTokenStatus = editTokenStatus;
const editAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { endingTime, startingTme } = req.body;
    console.log(typeof (endingTime), typeof (startingTme));
    const newavailability = `${startingTme}-${endingTime}`;
    console.log(newavailability);
    const editedavailability = yield DoctorDetails_1.default.findOneAndUpdate({ doctor: id }, { availability: newavailability }, { new: true });
    res.status(200).json({ status: true, message: 'availability edited successfully', data: editedavailability });
});
exports.editAvailability = editAvailability;
const searchDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctors = yield Doctor_1.default.find();
    const specialties = yield DoctorDetails_1.default.find();
    res.status(200).json({ doctors, specialties });
});
exports.searchDoctors = searchDoctors;
const addTokenPerDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { numberoftoken } = req.body;
    const newtokennumber = yield totalToken_1.default.findByIdAndUpdate(id, { tokenPerDay: numberoftoken }, { new: true });
    res.status(200).json({ status: true, message: "token number updated", data: newtokennumber });
});
exports.addTokenPerDay = addTokenPerDay;
