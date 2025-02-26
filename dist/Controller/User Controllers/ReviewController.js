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
exports.getUsersReviewforusers = exports.getUsersReview = exports.adduserReview = void 0;
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const userReview_1 = __importDefault(require("../../Models/userReview"));
const DoctorDetails_1 = __importDefault(require("../../Models/DoctorDetails"));
const adduserReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { reviewText, userId } = req.body;
    const newreview = new userReview_1.default({ doctorId, userId, reviewText });
    if (!newreview) {
        return next(new CustomError_1.default("failed to add new review"));
    }
    yield newreview.save();
    res.status(200).json({ status: true, message: "review added successfully", data: newreview });
});
exports.adduserReview = adduserReview;
const getUsersReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new CustomError_1.default("User ID is not provided"));
    }
    const reviews = yield userReview_1.default
        .find({ userId: id })
        .populate("doctorId", "name email phone")
        .lean();
    if (!reviews.length) {
        return next(new CustomError_1.default("Reviews not found"));
    }
    const doctorIds = reviews.map(review => review.doctorId._id.toString());
    const drDetails = yield DoctorDetails_1.default.find({ doctor: { $in: doctorIds } }, "doctor profileImage").lean();
    const doctorProfileMap = new Map(drDetails.map(doctor => [doctor.doctor.toString(), doctor.profileImage || null]));
    const updatedReviews = reviews.map(review => (Object.assign(Object.assign({}, review), { doctorId: Object.assign(Object.assign({}, review.doctorId), { profileImage: doctorProfileMap.get(review.doctorId._id.toString()) || null }) })));
    res.status(200).json({
        status: true,
        message: "User reviews fetched successfully",
        data: updatedReviews
    });
});
exports.getUsersReview = getUsersReview;
const getUsersReviewforusers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!id) {
        return next(new CustomError_1.default("User ID is not provided"));
    }
    const reviews = yield userReview_1.default
        .find({ userId: id })
        .populate("doctorId", "name email phone")
        .lean();
    if (!reviews.length) {
        return next(new CustomError_1.default("Reviews not found"));
    }
    const doctorIds = reviews.map(review => review.doctorId._id.toString());
    const drDetails = yield DoctorDetails_1.default.find({ doctor: { $in: doctorIds } }, "doctor profileImage").lean();
    const doctorProfileMap = new Map(drDetails.map(doctor => [doctor.doctor.toString(), doctor.profileImage || null]));
    const updatedReviews = reviews.map(review => (Object.assign(Object.assign({}, review), { doctorId: Object.assign(Object.assign({}, review.doctorId), { profileImage: doctorProfileMap.get(review.doctorId._id.toString()) || null }) })));
    res.status(200).json({
        status: true,
        message: "User reviews fetched successfully",
        data: updatedReviews
    });
});
exports.getUsersReviewforusers = getUsersReviewforusers;
