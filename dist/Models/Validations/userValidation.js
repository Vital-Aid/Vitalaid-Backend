"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationType = void 0;
const zod_1 = require("zod");
exports.userValidationType = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    profileImage: zod_1.z.object({
        originalProfile: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
    }).optional(),
    admin: zod_1.z.boolean().optional(),
    isDeleted: zod_1.z.boolean().optional(),
    phone: zod_1.z.string().min(10).optional(),
    createdAt: zod_1.z.date().optional(),
});
