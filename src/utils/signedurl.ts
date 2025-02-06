import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CustomError from "./CustomError";
dotenv.config();

type params = {
    Bucket: string;
    Key: string;
    ContentType: string;
}

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const generateSignedUrl = async (req: Request, res: Response, next: NextFunction) => {
    const { fileType } = req.query;
    
    if (!fileType) {
        return next(new CustomError("File type is required", 400))
    }
    if (typeof fileType !== 'string') {
        return next(new CustomError("Invalid file type", 400));
    }


    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileType.split('/')[1] || 'file';
    const fileName = `uploads/${timestamp}-${randomString}.${fileExtension}`;
    
    const bucketName = process.env.S3_BUCKET_NAME || "vitalaidnsr";
    const params: params = {
        Bucket: bucketName,
        Key: fileName,
        ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    
    res.json({ signedUrl, fileName });
};

