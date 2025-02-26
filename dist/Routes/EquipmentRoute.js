"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const ImageUpload_1 = require("../Middleware/ImageUpload");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const equipmentControllers_1 = require("../Controller/Admin controllers/equipmentControllers");
const userEquipmentController_1 = require("../Controller/User Controllers/userEquipmentController");
const equipmentRoute = express_1.default.Router();
equipmentRoute
    .post('/addequipment', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(equipmentControllers_1.addEquipment))
    .get('/getequipments', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(equipmentControllers_1.getAllEquipments))
    .get('/getequipment/:id', (0, tryCatch_1.default)(equipmentControllers_1.getEquipmentBYId))
    .put('/editEquipment/:id', authMiddleware_1.adminAuth, ImageUpload_1.upload.single('image'), (0, tryCatch_1.default)(equipmentControllers_1.editEquipments))
    .put('/deleteEquipment/:id', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(equipmentControllers_1.deleteEquipments))
    .get("/getTotalCount", (0, tryCatch_1.default)(userEquipmentController_1.totalEquipment));
exports.default = equipmentRoute;
