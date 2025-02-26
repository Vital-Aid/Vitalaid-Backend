"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const create_donation_1 = require("../Controller/User Controllers/create-donation");
const routes = express_1.default.Router();
routes
    .post('/createOrder', (0, tryCatch_1.default)(create_donation_1.createOrder))
    .post('/verifyPayment', (0, tryCatch_1.default)(create_donation_1.verifyPayment))
    .get('/allDonations', (0, tryCatch_1.default)(create_donation_1.allDonations))
    .get('/getAllDonations', (0, tryCatch_1.default)(create_donation_1.getAllDonations))
    .get('/getUserReceipt/:userId', (0, tryCatch_1.default)(create_donation_1.getUserReceipt))
    .get('/getAllDonationsById/:userId', (0, tryCatch_1.default)(create_donation_1.getAllDonationsById));
exports.default = routes;
