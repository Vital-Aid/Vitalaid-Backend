"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorAuth = exports.adminAuth = exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const userAuth = (req, res, next) => {
    var _a, _b;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(' ')[1] : null;
    if (!token) {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshmentToken;
        if (!refreshToken) {
            return next(new CustomError_1.default('Refresh token and access token are not available.', 404));
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        const newToken = jsonwebtoken_1.default.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '1m' });
        res.cookie('accessToken', newToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1 * 60 * 1000,
            sameSite: 'none',
        });
        req.user = decoded;
        return next();
    }
    else {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        }
        catch (error) {
            const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
            if (!refreshToken) {
                return next(new CustomError_1.default('Refreshment token and access token are not available.', 404));
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
            const newToken = jsonwebtoken_1.default.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, process.env.JWT_SECRET);
            res.cookie('accessToken', newToken, {
                httpOnly: true,
                secure: true,
                maxAge: 1 * 60 * 1000,
                sameSite: 'none',
            });
            req.user = decoded;
            return next();
        }
    }
};
exports.userAuth = userAuth;
const adminAuth = (req, res, next) => {
    userAuth(req, res, () => {
        if (req.user && req.user.role == 'Admin') {
            return next();
        }
        else {
            return next(new CustomError_1.default('You are not authorized', 403));
        }
    });
};
exports.adminAuth = adminAuth;
const doctorAuth = (req, res, next) => {
    console.log('Doctor auth middleware');
    userAuth(req, res, () => {
        if (req.user && req.user.role == 'Doctor') {
            return next();
        }
        else {
            return next(new CustomError_1.default('You are not authorized', 403));
        }
    });
};
exports.doctorAuth = doctorAuth;
