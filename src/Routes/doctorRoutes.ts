import express from "express";
import tryCatch from "../../utils/tryCatch";
import { getDoctersById, getDoctors } from "../Controller/User Controllers/doctorController";


const routes=express.Router()

routes
.get('/getdoctors',tryCatch(getDoctors))
.get('/getDoctersById/:_id',tryCatch(getDoctersById))
export default routes