import express, { Application,Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import CustomError from '../utils/CustomError';
import cors from "cors"
import routes from './Routes/authRoutes';
import docterRouts from "./Routes/doctorRoutes"
dotenv.config();

const authRoute=routes

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));

const app: Application = express();


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization',"X-MongoDb-Id"],
};

 
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth",authRoute)
app.use("/api/doctors",docterRouts)

app.all('*',(req:Request,res:Response,next:NextFunction)=>{
  const err=new CustomError(`cannot ${req.method} ${req.originalUrl}`,404)
  next(err)
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});