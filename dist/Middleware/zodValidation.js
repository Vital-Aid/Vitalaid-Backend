"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const zod_1 = require("zod");
const CustomError_1 = __importDefault(require("../utils/CustomError"));
function validateData(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw new CustomError_1.default(`Invalid data, ${error.errors[0].path}: ${error.errors[0].message}, 400`);
            }
            throw new CustomError_1.default("Error when validating data", 400);
        }
    };
}
