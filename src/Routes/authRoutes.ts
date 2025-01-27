import { UserValidationSchema, userValidationType } from './../Models/Validations/userValidation';
import express from "express";
import { validateData } from "../Middleware/zodValidation";
import tryCatch from "../utils/tryCatch";
import { docterRegistration, userLogin, userRegistration } from '../Controller/User Controllers/authController';


const routes=express.Router()

routes
.post('/register',validateData(userValidationType),tryCatch(userRegistration))
.post('/registerDocter',validateData(userValidationType),tryCatch(docterRegistration))
.post('/login',tryCatch(userLogin))
export default routes