"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userValidation_1 = require("./../Models/Validations/userValidation");
const express_1 = __importDefault(require("express"));
const zodValidation_1 = require("../Middleware/zodValidation");
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const authController_1 = require("../Controller/User Controllers/authController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const signedurl_1 = require("../utils/signedurl");
const routes = express_1.default.Router();
routes
    .post('/register', (0, zodValidation_1.validateData)(userValidation_1.userValidationType), (0, tryCatch_1.default)(authController_1.userRegistration))
    .post('/registerDocter', authMiddleware_1.adminAuth, (0, zodValidation_1.validateData)(userValidation_1.userValidationType), (0, tryCatch_1.default)(authController_1.docterRegistration))
    .post('/userlogin', (0, tryCatch_1.default)(authController_1.userlogin))
    .post('/doctorlogin', (0, tryCatch_1.default)(authController_1.doctorlogin))
    .post('/adminlogin', (0, tryCatch_1.default)(authController_1.adminlogin))
    .delete('/logout', (0, tryCatch_1.default)(authController_1.logout))
    .get("/generate-signed-url", (0, tryCatch_1.default)(signedurl_1.generateSignedUrl));
exports.default = routes;
