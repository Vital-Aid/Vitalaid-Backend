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
exports.logout = exports.adminlogin = exports.doctorlogin = exports.userlogin = exports.docterRegistration = exports.userRegistration = void 0;
const UserModel_1 = __importDefault(require("../../Models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Doctor_1 = __importDefault(require("../../Models/Doctor"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
dotenv_1.default.config();
const userRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 6);
    const newUser = yield new UserModel_1.default({
        name,
        email,
        password: hashedPassword,
        phone,
    });
    yield newUser.save();
    res.status(200).json({
        error: false,
        status: true,
        msg: "User registered successfully. Please check your email for the OTP.",
        data: newUser,
    });
});
exports.userRegistration = userRegistration;
const docterRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 6);
    const newDoctor = yield new Doctor_1.default({
        name,
        email,
        password: hashedPassword,
        phone,
    });
    yield newDoctor.save();
    res.status(200).json({
        error: false,
        status: true,
        msg: "User registered successfully. Please check your email for the OTP.",
        data: newDoctor,
    });
});
exports.docterRegistration = docterRegistration;
const userlogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield UserModel_1.default.findOne({ email, admin: false });
    if (!user) {
        return next(new CustomError_1.default('user not found', 404));
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new CustomError_1.default("Invalid email or password", 404));
    }
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email,
        role: 'User',
    }, process.env.JWT_SECRET, { expiresIn: "1m" });
    const refreshmentToken = jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email,
        role: 'User',
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    yield UserModel_1.default.findByIdAndUpdate(user._id, { updatedAt: Date.now() }, { new: true });
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 1000,
        sameSite: 'none',
    });
    res.cookie('refreshToken', refreshmentToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    });
    res.cookie(`user`, "user", {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    });
    res.status(200).json({
        error: false,
        message: `user Login successfully`,
        accessToken: token,
        refreshmentToken: refreshmentToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: 'User',
            phone: user.phone
        },
    });
});
exports.userlogin = userlogin;
const doctorlogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const doctor = yield Doctor_1.default.findOne({ email });
    if (!doctor) {
        return next(new CustomError_1.default('Doctor not found', 404));
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, doctor.password);
    if (!isPasswordValid) {
        return next(new CustomError_1.default("Invalid email or password", 404));
    }
    const token = jsonwebtoken_1.default.sign({
        id: doctor._id,
        email: doctor.email,
        role: 'Doctor',
    }, process.env.JWT_SECRET, { expiresIn: "1m" });
    const refreshToken = jsonwebtoken_1.default.sign({
        id: doctor._id,
        email: doctor.email,
        role: 'Doctor',
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 1000,
        sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    });
    res.cookie(`user`, "Doctor", {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    });
    res.status(200).json({
        error: false,
        message: `Doctor Login successfully`,
        user: {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            role: 'Doctor',
            phone: doctor.phone
        },
    });
});
exports.doctorlogin = doctorlogin;
const adminlogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield UserModel_1.default.findOne({ email, admin: true });
    if (!user) {
        return next(new CustomError_1.default('user not found', 404));
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new CustomError_1.default("Invalid email or password", 404));
    }
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email,
        role: 'Admin',
    }, process.env.JWT_SECRET, { expiresIn: "1m" });
    const refreshmentToken = jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email,
        role: 'Admin',
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 1000,
        sameSite: 'none',
    });
    res.cookie('refreshToken', refreshmentToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    });
    res.cookie(`user`, "Admin", {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    });
    res.status(200).json({
        error: false,
        message: `Admin Login successfully`,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: 'Admin',
            phone: user.phone
        },
    });
});
exports.adminlogin = adminlogin;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('user');
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
});
exports.logout = logout;
