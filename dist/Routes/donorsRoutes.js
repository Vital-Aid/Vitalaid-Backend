"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const ImageUpload_1 = require("../Middleware/ImageUpload");
const bloodDonors_1 = require("../Controller/Admin controllers/bloodDonors");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const donnersRoutes = express_1.default.Router();
donnersRoutes
    .post('/addDoners', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(bloodDonors_1.addDonor))
    .get('/getDonors', (0, tryCatch_1.default)(bloodDonors_1.getDonors))
    .get('/getDonorsById/:id', (0, tryCatch_1.default)(bloodDonors_1.getDonorsById))
    .put('/editDonors/:id', authMiddleware_1.adminAuth, ImageUpload_1.upload.single("image"), (0, tryCatch_1.default)(bloodDonors_1.editDonors))
    .post('/deleteDoner/:id', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(bloodDonors_1.deleteDoner));
exports.default = donnersRoutes;
