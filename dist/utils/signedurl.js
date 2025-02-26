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
exports.generateSignedUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const CustomError_1 = __importDefault(require("./CustomError"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const generateSignedUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileType } = req.query;
    if (!fileType) {
        return next(new CustomError_1.default("File type is required", 400));
    }
    if (typeof fileType !== 'string') {
        return next(new CustomError_1.default("Invalid file type", 400));
    }
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileType.split('/')[1] || 'file';
    const fileName = `uploads/${timestamp}-${randomString}.${fileExtension}`;
    const bucketName = process.env.S3_BUCKET_NAME || "vitalaidnsr";
    const params = {
        Bucket: bucketName,
        Key: fileName,
        ContentType: fileType,
    };
    const command = new client_s3_1.PutObjectCommand(params);
    const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 60 });
    res.json({ signedUrl, fileName });
});
exports.generateSignedUrl = generateSignedUrl;
