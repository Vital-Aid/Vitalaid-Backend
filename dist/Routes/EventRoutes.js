"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const adminController_1 = require("../Controller/Admin controllers/adminController");
const ImageUpload_1 = require("../Middleware/ImageUpload");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const eventRoutes = express_1.default.Router();
eventRoutes
    .post('/addevents', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(adminController_1.addEvent))
    .get('/getevents', (0, tryCatch_1.default)(adminController_1.getEvents))
    .get('/getAllevents', (0, tryCatch_1.default)(adminController_1.getAllEvents))
    .get('/geteventbyid/:id', (0, tryCatch_1.default)(adminController_1.getEventById))
    .put('/editevent/:id', authMiddleware_1.adminAuth, ImageUpload_1.upload.single("image"), (0, tryCatch_1.default)(adminController_1.editEvents))
    .post('/deleteEvent/:id', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(adminController_1.deleteEvent));
exports.default = eventRoutes;
