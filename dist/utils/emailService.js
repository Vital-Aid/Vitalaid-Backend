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
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.Email,
        pass: process.env.Email_password,
    },
});
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.Email,
        to,
        subject,
        html,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
exports.default = sendEmail;
