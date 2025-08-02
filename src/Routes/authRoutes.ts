import { UserValidationSchema, userValidationType } from './../Models/Validations/userValidation';
import express from "express";
import { validateData } from "../Middleware/zodValidation";
import tryCatch from "../utils/tryCatch";
import { adminlogin, docterRegistration, doctorlogin, logout, userlogin, userRegistration } from '../Controller/User Controllers/authController';
import { adminAuth } from '../Middleware/authMiddleware';
import { generateSignedUrl } from '../utils/signedurl';


const routes = express.Router()

routes

    .post('/register', validateData(userValidationType), tryCatch(userRegistration))
    .post('/registerDocter', adminAuth, validateData(userValidationType), tryCatch(docterRegistration))
    .post('/userlogin', tryCatch(userlogin))
    .post('/doctorlogin', tryCatch(doctorlogin))
    .post('/adminlogin', tryCatch(adminlogin))
    .delete('/logout',tryCatch(logout)) 
    .get("/generate-signed-url", tryCatch(generateSignedUrl))

export default routes