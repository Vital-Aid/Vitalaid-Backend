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
exports.deleteDoner = exports.editDonors = exports.getDonorsById = exports.getDonors = exports.addDonor = void 0;
const BloodDonors_1 = __importDefault(require("../../Models/BloodDonors"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
;
const addDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, BloodGroup, Phone, Gender, Age, Address, imageUrl } = req.body;
    if (!imageUrl) {
        return next(new CustomError_1.default("Image URL is required", 400));
    }
    const existingDonor = yield BloodDonors_1.default.findOne({ Phone });
    if (existingDonor) {
        return next(new CustomError_1.default("Donor with this phone number already exists.", 409));
    }
    const newDonor = new BloodDonors_1.default({
        name,
        BloodGroup,
        Phone,
        Gender,
        Age,
        Address,
        image: imageUrl,
    });
    yield newDonor.save();
    res.status(201).json({ success: true, message: "Donor added successfully!", donor: newDonor });
});
exports.addDonor = addDonor;
const getDonors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totaldonor = yield BloodDonors_1.default.countDocuments({ isDeleted: false });
    const donors = yield BloodDonors_1.default.find({ isDeleted: false }).skip((page - 1) * limit).limit(limit);
    if (!donors) {
        return next(new CustomError_1.default('donors not found', 404));
    }
    res.status(200).json({
        error: 'false',
        donors: donors,
        totalPages: Math.ceil(totaldonor / limit),
        currentPage: page,
        totaldonor
    });
});
exports.getDonors = getDonors;
const getDonorsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const donors = yield BloodDonors_1.default.findById(id);
    if (!donors) {
        return next(new CustomError_1.default('event not found', 404));
    }
    res.status(200).json({ error: 'false', donors: donors });
});
exports.getDonorsById = getDonorsById;
const editDonors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, BloodGroup, Phone, Gender, Age, Address } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
    const eventData = { name, BloodGroup, Phone, Gender, Age, Address, image };
    const editedBloodDonor = yield BloodDonors_1.default.findByIdAndUpdate(id, eventData, { new: true });
    res.status(200).json({ error: 'false', message: 'donor edited successfully', donors: editedBloodDonor });
});
exports.editDonors = editDonors;
const deleteDoner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedoner = yield BloodDonors_1.default.findById(id);
    if (!deletedoner) {
        return next(new CustomError_1.default("Event not found", 404));
    }
    deletedoner.isDeleted = !deletedoner.isDeleted;
    yield deletedoner.save();
    res.status(200).json({ error: false, event: deletedoner });
});
exports.deleteDoner = deleteDoner;
