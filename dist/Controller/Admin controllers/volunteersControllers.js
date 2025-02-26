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
exports.deleteVolunteers = exports.editvolunteers = exports.getvolonteersById = exports.getVolunteers = exports.addVolunteers = void 0;
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const Volunteer_1 = __importDefault(require("../../Models/Volunteer"));
;
const addVolunteers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, gender, image } = req.body;
    const newvolunteers = new Volunteer_1.default({ name, phone, gender, image });
    if (!newvolunteers) {
        return next(new CustomError_1.default('detailes not recived', 404));
    }
    yield newvolunteers.save();
    res.status(200).json({ error: false, message: 'A new volunteer has been successfully added.', data: newvolunteers });
});
exports.addVolunteers = addVolunteers;
const getVolunteers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalvolunteer = yield Volunteer_1.default.countDocuments({ isDeleted: false });
    const volunteers = yield Volunteer_1.default.find({ isDeleted: false }).skip((page - 1) * limit).limit(limit);
    if (!volunteers || volunteers.length == 0) {
        return next(new CustomError_1.default('Volunteers not found', 404));
    }
    res.status(200).json({
        error: false,
        message: 'all volunteers',
        allVolunteers: volunteers,
        totalPages: Math.ceil(totalvolunteer / limit),
        currentPage: page,
        totalvolunteer
    });
});
exports.getVolunteers = getVolunteers;
const getvolonteersById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new CustomError_1.default('id not found', 404));
    }
    const volunteer = yield Volunteer_1.default.findById(id);
    if (!volunteer) {
        return next(new CustomError_1.default('volunteer not found', 404));
    }
    res.status(200).json({ error: false, message: 'volunteer by id', data: volunteer });
});
exports.getvolonteersById = getvolonteersById;
const editvolunteers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, phone, gender } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
    const editedDetailes = { name, phone, gender, image };
    const editedvolunteer = yield Volunteer_1.default.findByIdAndUpdate(id, editedDetailes, { new: true });
    res.status(200).json({ error: false, message: 'The volunteer has been edited successfully.', data: editedvolunteer });
});
exports.editvolunteers = editvolunteers;
const deleteVolunteers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedvolunteer = yield Volunteer_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    res.status(200).json({ error: false, message: 'Volunteers have been deleted successfully.', data: deletedvolunteer });
});
exports.deleteVolunteers = deleteVolunteers;
