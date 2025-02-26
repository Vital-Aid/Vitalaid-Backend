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
exports.totalEquipment = exports.updaterequest = exports.removeRequest = exports.getRequestbyuser = exports.makeRequest = void 0;
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const Equipment_1 = __importDefault(require("../../Models/Equipment"));
const Request_1 = __importDefault(require("../../Models/Request"));
const makeRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { equipment, location } = req.body;
    const newrequest = new Request_1.default({
        user: user,
        equipment: equipment,
        location: location,
    });
    yield newrequest.save();
    const item = yield Equipment_1.default.findById(equipment);
    if (!item || typeof item.quantity !== "number") {
        return next(new CustomError_1.default("Equipment not found or has no quantity", 404));
    }
    const quantity = (item === null || item === void 0 ? void 0 : item.quantity) - 1;
    yield Equipment_1.default.findByIdAndUpdate(equipment, { quantity: quantity }, { new: true });
    res
        .status(200)
        .json({
        error: false,
        message: "request added successfully",
        data: newrequest,
    });
});
exports.makeRequest = makeRequest;
const getRequestbyuser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log("User ID:", user);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalRequests = yield Request_1.default.countDocuments({ user });
    const requests = yield Request_1.default.find({ user })
        .populate("equipment", "name description quantity image")
        .populate("user", "name email")
        .skip((page - 1) * limit)
        .limit(limit);
    console.log("Requests:", requests);
    if (!requests.length) {
        return next(new CustomError_1.default("No requests found", 404));
    }
    res.status(200).json({
        error: false,
        message: "User requests",
        data: requests,
        totalPages: Math.ceil(totalRequests / limit),
        currentPage: page,
        totalRequests,
    });
});
exports.getRequestbyuser = getRequestbyuser;
const removeRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { equipment } = req.params;
    const deleteRequest = yield Request_1.default.findByIdAndDelete(equipment);
    res
        .status(200)
        .json({ error: false, message: "Request deleted", data: deleteRequest });
});
exports.removeRequest = removeRequest;
const updaterequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const status = req.body;
    const updatedrequest = yield Request_1.default.findByIdAndUpdate(id, status, {
        new: true,
    });
    res
        .status(200)
        .json({ error: false, message: "request updated", data: updatedrequest });
});
exports.updaterequest = updaterequest;
const totalEquipment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Total = yield Equipment_1.default.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: null, totalCount: { $sum: "$quantity" } } },
    ]);
    res.status(200).json({
        status: true,
        message: "total equipment",
        data: Total
    });
});
exports.totalEquipment = totalEquipment;
