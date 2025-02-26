"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../Middleware/authMiddleware");
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const volunteersControllers_1 = require("../Controller/Admin controllers/volunteersControllers");
const ImageUpload_1 = require("../Middleware/ImageUpload");
const volunteerRoute = express_1.default.Router();
volunteerRoute
    .post('/add', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(volunteersControllers_1.addVolunteers))
    .get('/getall', (0, tryCatch_1.default)(volunteersControllers_1.getVolunteers))
    .get('/getbyid/:id', (0, tryCatch_1.default)(volunteersControllers_1.getvolonteersById))
    .put('/edit/:id', authMiddleware_1.adminAuth, ImageUpload_1.upload.single('image'), (0, tryCatch_1.default)(volunteersControllers_1.editvolunteers))
    .put('/delete/:id', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(volunteersControllers_1.deleteVolunteers));
exports.default = volunteerRoute;
