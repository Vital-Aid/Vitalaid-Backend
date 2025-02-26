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
exports.getAllequipmetRequests = exports.deleteEquipments = exports.editEquipments = exports.getEquipmentBYId = exports.getAllEquipments = exports.addEquipment = void 0;
const Equipment_1 = __importDefault(require("../../Models/Equipment"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const Request_1 = __importDefault(require("../../Models/Request"));
;
const addEquipment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, quantity, name, imageUrl } = req.body;
    const equipmentData = { description, quantity, name, image: imageUrl };
    const newequipment = yield new Equipment_1.default(equipmentData);
    yield newequipment.save();
    res.status(200).json({ error: false, message: 'aquipment added successfully', data: newequipment });
});
exports.addEquipment = addEquipment;
const getAllEquipments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalequipment = yield Equipment_1.default.countDocuments({ isDeleted: false });
    const equipments = yield Equipment_1.default.find({ isDeleted: false }).skip((page - 1) * limit).limit(limit);
    if (!equipments) {
        return next(new CustomError_1.default('equipments not found', 404));
    }
    res.status(200).json({
        error: false,
        allEquipment: equipments,
        totalPages: Math.ceil(totalequipment / limit),
        currentPage: page,
        totalequipment
    });
});
exports.getAllEquipments = getAllEquipments;
const getEquipmentBYId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return next(new CustomError_1.default('ID not provided', 404));
    }
    const equipment = yield Equipment_1.default.findById(id);
    if (!equipment) {
        return next(new CustomError_1.default('equipment not found', 404));
    }
    res.status(200).json({ error: false, data: equipment });
});
exports.getEquipmentBYId = getEquipmentBYId;
const editEquipments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { description, quantity, name } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
    const equipmentData = { description, quantity, name, image };
    const updateEquipment = yield Equipment_1.default.findByIdAndUpdate(id, equipmentData, { new: true });
    res.status(200).json({ error: false, message: 'aquipment added successfully', data: updateEquipment });
});
exports.editEquipments = editEquipments;
const deleteEquipments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedeuipment = yield Equipment_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedeuipment) {
        return next(new CustomError_1.default('equipment not found', 404));
    }
    res.status(200).json({ error: false, message: 'equipment updated', data: deletedeuipment });
});
exports.deleteEquipments = deleteEquipments;
const getAllequipmetRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalRequests = yield Request_1.default.countDocuments();
    const requests = yield Request_1.default.find()
        .populate("user", "name email")
        .populate("equipment", "name description quantity image")
        .skip((page - 1) * limit)
        .limit(limit);
    if (!requests.length) {
        return next(new CustomError_1.default("Requests not found", 404));
    }
    res.status(200).json({
        error: false,
        message: "All equipment requests",
        data: requests,
        totalPages: Math.ceil(totalRequests / limit),
        currentPage: page,
        totalRequests
    });
});
exports.getAllequipmetRequests = getAllequipmetRequests;
