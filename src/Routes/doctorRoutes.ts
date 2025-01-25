import express from "express";
import tryCatch from "../../utils/tryCatch";
import { getDoctersById, getDoctors } from "../Controller/User Controllers/doctorController";
import { adminAuth, doctorAuth, userAuth } from "../Middleware/authMiddleware";

const routes=express.Router()

routes
.get('/getdoctors',adminAuth,tryCatch(getDoctors))
.get('/getDoctersById/:_id',tryCatch(getDoctersById))
export default routes
