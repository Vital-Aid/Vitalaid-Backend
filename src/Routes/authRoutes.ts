import { UserValidationSchema, userValidationType } from './../Models/Validations/userValidation';
import express from "express";
import { validateData } from "../Middleware/zodValidation";
import tryCatch from "../utils/tryCatch";
import { adminlogin, docterRegistration, doctorlogin, userlogin, userRegistration } from '../Controller/User Controllers/authController';


const routes=express.Router()

routes
.post('/register',validateData(userValidationType),tryCatch(userRegistration))
.post('/registerDocter',validateData(userValidationType),tryCatch(docterRegistration))
.post('/userlogin',tryCatch(userlogin))
.post('/doctorlogin',tryCatch(doctorlogin))
.post('/adminlogin',tryCatch(adminlogin))

export default routes