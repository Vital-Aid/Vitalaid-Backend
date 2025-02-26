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
exports.deleteReview = exports.getReview = exports.addReview = exports.getUsersUpdatedToday = exports.getTokenByUser = exports.getallTokenByUser = exports.otpVerification = exports.createToken = exports.searchDoctors = exports.editDetails = exports.getDetails = exports.addDetails = exports.blockUser = exports.getUserById = exports.getblockedUsers = exports.getUsers = void 0;
const UserModel_1 = __importDefault(require("../../Models/UserModel"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const Medicalhistory_1 = __importDefault(require("../../Models/Medicalhistory"));
const token_1 = __importDefault(require("../../Models/token"));
const mongoose_1 = __importDefault(require("mongoose"));
const Doctor_1 = __importDefault(require("../../Models/Doctor"));
const DoctorDetails_1 = __importDefault(require("../../Models/DoctorDetails"));
const emailService_1 = __importDefault(require("../../utils/emailService"));
const Review_1 = __importDefault(require("../../Models/Review"));
const Userdetails_1 = __importDefault(require("../../Models/Userdetails"));
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalusers = yield UserModel_1.default.countDocuments({
        isDeleted: false,
        blocked: false,
    });
    const users = yield UserModel_1.default.find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);
    if (!users) {
        return next(new CustomError_1.default("users not found", 404));
    }
    res.status(200).json({
        users: users,
        totalPages: Math.ceil(totalusers / limit),
        currentPage: page,
    });
});
exports.getUsers = getUsers;
const getblockedUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserModel_1.default.find({ isDeleted: false, blocked: true });
    if (!users) {
        return next(new CustomError_1.default("users not found", 404));
    }
    res.status(200).json({ users: users });
});
exports.getblockedUsers = getblockedUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log('id:', id);
    const medHistory = yield Medicalhistory_1.default.find({ User: id })
        .populate("User", "name email phone")
        .lean();
    const userDetails = yield Userdetails_1.default.findOne({ user: id }).lean();
    const user = yield UserModel_1.default.findOne({ _id: id }).lean(); // Add .lean() to return a plain JS object
    if (!user) {
        return next(new CustomError_1.default("User not found", 404));
    }
    if (!userDetails) {
        return next(new CustomError_1.default("User details not found", 404));
    }
    const result = { medHistory, userDetails, user };
    res.status(200).json({
        status: true,
        message: "User medical history and details",
        data: result,
    });
});
exports.getUserById = getUserById;
const blockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const blockedUser = yield UserModel_1.default.findById(_id);
    if (!blockedUser) {
        return next(new CustomError_1.default("blockeUser not found"));
    }
    blockedUser.blocked = !blockedUser.blocked;
    yield blockedUser.save();
    res.status(200).json({
        message: blockedUser.blocked
            ? "User has been blocked"
            : "User has been unblocked",
        user: blockedUser,
    });
});
exports.blockUser = blockUser;
const addDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { age, occupation, address, gender, bloodgroup, profileImage } = req.body;
    const user = req.params.id;
    const Details = new Userdetails_1.default({
        user,
        address,
        age,
        occupation,
        gender,
        bloodgroup,
        profileImage: {
            thumbnail: "",
            originalProfile: profileImage,
        },
    });
    const saveddetails = yield Details.save();
    res.status(201).json({
        error: false,
        message: "Details added",
        data: saveddetails,
    });
});
exports.addDetails = addDetails;
const getDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield Userdetails_1.default.find({ user: req.params.id });
    if (!userDetails) {
        return next(new CustomError_1.default("No Details found for this user", 404));
    }
    res.status(200).json(userDetails);
});
exports.getDetails = getDetails;
const editDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, age, occupation, address, gender, bloodgroup, profileImage } = req.body;
    const userId = id;
    const updateData = {
        age,
        occupation,
        address,
        gender,
        bloodgroup,
        profileImage: {
            thumbnail: "",
            originalProfile: profileImage,
        },
    };
    const updatedDetails = yield Userdetails_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
    if (!updatedDetails) {
        return next(new CustomError_1.default("User details not found", 404));
    }
    res.status(200).json({
        error: false,
        message: "Details updated successfully",
        data: updatedDetails,
    });
});
exports.editDetails = editDetails;
const searchDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctors = yield Doctor_1.default.find();
    const specialties = yield DoctorDetails_1.default.find();
    res.status(200).json({ doctors, specialties });
});
exports.searchDoctors = searchDoctors;
const createToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { date, doctorId, tokenNumber } = req.body;
    const patientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!req.user || !req.user.id || !req.user.email) {
        return next(new CustomError_1.default("Unauthorized: User ID or Email is missing", 401));
    }
    const email = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
    if (!patientId) {
        return next(new CustomError_1.default("Patient ID is required"));
    }
    const patientObjectId = new mongoose_1.default.Types.ObjectId(patientId);
    const doctorObjectId = new mongoose_1.default.Types.ObjectId(doctorId);
    const oldToken = yield token_1.default.findOne({
        patientId: patientObjectId,
        date: date,
        doctorId: doctorObjectId,
        tokenNumber: tokenNumber,
    });
    if (oldToken) {
        return next(new CustomError_1.default("This token is already booked"));
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Create new token
    const newToken = new token_1.default({
        date,
        doctorId: doctorObjectId,
        tokenNumber,
        otp,
        patientId: patientObjectId
    });
    yield newToken.save();
    const emailSubject = "Your OTP for Appointment Confirmation";
    const emailBody = `<p>Your OTP for confirming your appointment is: <strong>${otp}</strong></p>`;
    try {
        yield (0, emailService_1.default)(email, emailSubject, emailBody);
        const io = req.app.get("io");
        io.emit("tokenUpdated", newToken);
        res.status(200).json({ status: true, message: 'Token created successfully', data: newToken });
    }
    catch (error) {
        return next(new CustomError_1.default("Failed to send OTP email"));
    }
});
exports.createToken = createToken;
const otpVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { otp } = req.body;
    console.log("otp:", otp);
    const io = req.app.get("io");
    console.log("Socket instance in controller:", io);
    const token = yield token_1.default.findOne({ otp });
    if (!token) {
        return next(new CustomError_1.default("Invalid OTP"));
    }
    token.isVerified = true;
    token.otp = null;
    yield token.save();
    io.emit("otpVerified", { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, status: "verified" });
    res.status(200).json({
        status: true,
        message: "OTP verification successful",
        data: token,
    });
});
exports.otpVerification = otpVerification;
const getallTokenByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        res.status(401).json({ status: false, message: "Unauthorized access" });
        return;
    }
    const id = req.user.id;
    const { date } = req.query;
    if (!date) {
        res.status(400).json({ status: false, message: "Date is required" });
        return;
    }
    const tokens = yield token_1.default.find({ patientId: id, date, isVerified: true })
        .populate("doctorId", "name email phone")
        .lean()
        .exec();
    yield Promise.all(tokens.map((token) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if ((_a = token.doctorId) === null || _a === void 0 ? void 0 : _a._id) {
            const drDetails = yield DoctorDetails_1.default.findOne({ doctor: token.doctorId._id })
                .select("qualification specialization availability profileImage description hospital address certificates")
                .lean()
                .exec();
            token.doctorId = Object.assign(Object.assign({}, token.doctorId), { drDetails: drDetails || null });
        }
    })));
    res.status(200).json({
        status: true,
        message: "User's tokens fetched successfully.",
        data: tokens,
    });
    return;
});
exports.getallTokenByUser = getallTokenByUser;
const getTokenByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const tokens = (yield token_1.default.find({ patientId: id })
        .populate("doctorId", "name email phone")
        .lean());
    if (!tokens || tokens.length === 0) {
        return next(new CustomError_1.default("Tokens not available."));
    }
    console.log("tokens", tokens);
    res.status(200).json({
        status: true,
        message: "User's tokens fetched successfully.",
        data: tokens,
    });
});
exports.getTokenByUser = getTokenByUser;
const getUsersUpdatedToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);
    const count = yield UserModel_1.default.countDocuments({
        updatedAt: {
            $gte: startOfDay,
            $lt: endOfDay,
        },
    });
    res.status(200).json({
        success: true,
        count,
        date: startOfDay.toISOString().split("T")[0],
    });
});
exports.getUsersUpdatedToday = getUsersUpdatedToday;
const addReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { doctorId, rating, comment } = req.body;
    const newReview = new Review_1.default({ userId: id, doctorId, rating, comment });
    yield newReview.save();
    res.status(200).json({ status: true, message: "review added successfully", data: newReview });
});
exports.addReview = addReview;
const getReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!id) {
        return next(new CustomError_1.default("Doctor id is not provided"));
    }
    const reviews = yield Review_1.default.find({ doctorId: id, isDeleted: false })
        .populate("userId", "name")
        .lean();
    if (!reviews.length) {
        return next(new CustomError_1.default("Reviews not found"));
    }
    const userIds = reviews.map(review => review.userId._id.toString());
    const userDetails = yield Userdetails_1.default.find({ user: { $in: userIds } }, "user profileImage").lean();
    console.log('fvdv', userDetails);
    const userProfileMap = new Map(userDetails.map(user => { var _a; return [user.user.toString(), (_a = user === null || user === void 0 ? void 0 : user.profileImage) === null || _a === void 0 ? void 0 : _a.originalProfile]; }));
    const updatedReviews = reviews.map(review => (Object.assign(Object.assign({}, review), { userId: Object.assign(Object.assign({}, review.userId), { profileImage: userProfileMap.get(review.userId._id.toString()) || null }) })));
    res.status(200).json({
        status: true,
        message: "Doctor reviews",
        data: updatedReviews
    });
});
exports.getReview = getReview;
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedreciew = yield Review_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    res.status(200).json({ status: true, message: "review deleted successfully", data: exports.deleteReview });
});
exports.deleteReview = deleteReview;
