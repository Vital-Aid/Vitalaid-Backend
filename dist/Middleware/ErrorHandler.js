"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const status = err.status || "error";
    console.error("errr", message);
    console.log(err);
    res.status(statusCode).json({
        status,
        message,
        statusCode,
    });
};
exports.default = errorHandler;
