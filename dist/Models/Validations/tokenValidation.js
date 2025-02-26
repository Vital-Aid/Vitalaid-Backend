"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenValidationSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const statusEnum = zod_1.z.enum(["pending", "cancelled", "Completed"]);
exports.tokenValidationSchema = zod_1.z.object({
    doctorId: zod_1.z.string().nonempty("Doctor ID is required").refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), { message: "Invalid doctor ID format" }),
    date: zod_1.z
        .string()
        .transform((date) => {
        const sanitizedDate = date.replace(/\//g, "-");
        const [day, month, year] = sanitizedDate.split("-");
        return `${year}-${month}-${day}`;
    })
        .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    status: statusEnum.default("pending"),
    tokenNumber: zod_1.z
        .number()
        .int({ message: "Token number must be an integer." })
        .positive({ message: "Token number must be a positive value." }),
});
