import { UserValidationSchema, userValidationType } from './../Models/Validations/userValidation';
import express from "express";
import { validateData } from "../Middleware/zodValidation";
import tryCatch from "../utils/tryCatch";
import { adminlogin, docterRegistration, doctorlogin, logout, userlogin, userRegistration } from '../Controller/User Controllers/authController';
import { adminAuth } from '../Middleware/authMiddleware';


const routes=express.Router()

routes
.post('/register',validateData(userValidationType),tryCatch(userRegistration))
.post('/registerDocter',adminAuth,validateData(userValidationType),tryCatch(docterRegistration))
.post('/userlogin',tryCatch(userlogin))
.post('/doctorlogin',tryCatch(doctorlogin))
.post('/adminlogin',tryCatch(adminlogin))
.delete('/logout',adminAuth,tryCatch(logout))

export default routes