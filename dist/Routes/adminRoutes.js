"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const authMiddleware_1 = require("../Middleware/authMiddleware");
const userEquipmentController_1 = require("../Controller/User Controllers/userEquipmentController");
const searchController_1 = require("../Controller/searchController");
const equipmentControllers_1 = require("../Controller/Admin controllers/equipmentControllers");
const adminRoute = express_1.default.Router();
adminRoute
    .put("/updateequipmentrequest/:id", authMiddleware_1.adminAuth, (0, tryCatch_1.default)(userEquipmentController_1.updaterequest))
    .get("/searchvolunteer", authMiddleware_1.adminAuth, (0, tryCatch_1.default)(searchController_1.searchvolunteer))
    .get('/searchequipments', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(searchController_1.searchEquipments))
    .get('/getallrequests', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(equipmentControllers_1.getAllequipmetRequests));
exports.default = adminRoute;
