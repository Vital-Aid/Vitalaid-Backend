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
exports.getmsgusr = exports.msgtodr = exports.newMessages = exports.deleteEvent = exports.editEvents = exports.getEventById = exports.getAllEvents = exports.getEvents = exports.addEvent = void 0;
const Event_1 = __importDefault(require("../../Models/Event"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const Message_1 = __importDefault(require("../../Models/Message"));
;
const addEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    const { organization, location, date, description, title, imageUrl } = req.body;
    console.log("Image URL:", imageUrl);
    if (!imageUrl) {
        return next(new CustomError_1.default('image is required', 404));
    }
    const newEvent = new Event_1.default({ title, organization, location, image: imageUrl, date, description });
    yield newEvent.save();
    res.status(200).json({ error: false, message: 'Event added successfully', event: newEvent });
});
exports.addEvent = addEvent;
const getEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError_1.default("Invalid pagination parameters", 400));
    }
    const totalevents = yield Event_1.default.countDocuments({ isDeleted: false });
    const events = yield Event_1.default.find({ isDeleted: false }).skip((page - 1) * limit).limit(limit);
    if (!events) {
        return next(new CustomError_1.default("Events not found", 404));
    }
    res.status(200).json({
        error: 'false',
        events: events,
        totalPages: Math.ceil(totalevents / limit),
        currentPage: page,
        totalevents
    });
});
exports.getEvents = getEvents;
const getAllEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield Event_1.default.find({ isDeleted: false });
    if (!events) {
        return next(new CustomError_1.default("Events not found", 404));
    }
    res.status(200).json({
        error: 'false',
        events: events,
    });
});
exports.getAllEvents = getAllEvents;
const getEventById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const event = yield Event_1.default.findById(id);
    if (!event) {
        return next(new CustomError_1.default('event not found', 404));
    }
    res.status(200).json({ error: 'false', event: event });
});
exports.getEventById = getEventById;
const editEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { organization, location, date, description, title } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.location;
    const eventData = { organization, location, date, description, title, image };
    const editedEvent = yield Event_1.default.findByIdAndUpdate(id, eventData, { new: true });
    res.status(200).json({ error: 'false', message: 'event edited successfully', event: editedEvent });
});
exports.editEvents = editEvents;
const deleteEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleteEvent = yield Event_1.default.findById(id);
    if (!deleteEvent) {
        return next(new CustomError_1.default("Event not found", 404));
    }
    deleteEvent.isDeleted = !deleteEvent.isDeleted;
    yield deleteEvent.save();
    res.status(200).json({ error: false, event: deleteEvent });
});
exports.deleteEvent = deleteEvent;
const newMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    const newmessage = new Message_1.default({
        message,
        todoctor: false
    });
    yield newmessage.save();
    res.status(201).json({
        error: false,
        message: "message created",
        data: newmessage
    });
});
exports.newMessages = newMessages;
const msgtodr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    const newmessage = new Message_1.default({
        message,
        todoctor: true
    });
    yield newmessage.save();
    res.status(201).json({
        error: false,
        message: "message created for doctor",
        data: newmessage
    });
});
exports.msgtodr = msgtodr;
const getmsgusr = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message_1.default.find({ todoctor: false });
    if (!message) {
        return next(new CustomError_1.default("message not found"));
    }
    res.status(200).json({
        message: "user message",
        data: message
    });
});
exports.getmsgusr = getmsgusr;
