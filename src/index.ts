import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import CustomError from './utils/CustomError';
import cors from "cors"
import routes from './Routes/authRoutes';
import docterRouts from "./Routes/doctorRoutes"
import cookieParser from 'cookie-parser';
import eventRoutes from './Routes/EventRoutes';
import userRoutes from './Routes/userRoutes'
import equipmentRoute from './Routes/EquipmentRoute';
import volunteerRoute from './Routes/volonteersRoutes';
import errorHandler from './Middleware/ErrorHandler';
import donnersRoutes from './Routes/donorsRoutes';
import adminRoute from './Routes/adminRoutes';
import donationRoutes from'./Routes/donetionRoutes'
import { app, server } from "./socket/socket";
dotenv.config();


const authRoute = routes

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));




const corsOptions = {
  origin: process.env.FRONTENT_URI,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', "X-MongoDb-Id"],
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoute)
app.use("/api/doctors",docterRouts)
app.use("/api/events",eventRoutes)
app.use("/api/equipment",equipmentRoute)
app.use("/api/users",userRoutes)
app.use("/api/volunteers",volunteerRoute)
app.use("/api/donors",donnersRoutes)
app.use("/api/admin",adminRoute)
app.use("/api/donation",donationRoutes)
app.use(errorHandler)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError(`cannot ${req.method} ${req.originalUrl}`, 404)
  next(err)
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});