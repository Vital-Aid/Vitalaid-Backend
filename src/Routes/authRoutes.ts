import { UserValidationSchema, userValidationType } from './../Models/Validations/userValidation';
import express from "express";
import { validateData } from "../Middleware/zodValidation";
import tryCatch from "../../utils/tryCatch";
import { userRegistration } from '../Controller/User Controllers/authController';


const routes=express.Router()

routes
.post('/register',validateData(userValidationType),tryCatch(userRegistration))

export default routes