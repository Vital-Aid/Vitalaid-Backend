
import express from 'express'
import tryCatch from "../utils/tryCatch";
import { adminAuth } from '../Middleware/authMiddleware';
import { updaterequest } from '../Controller/User Controllers/userEquipmentController';



const adminRoute=express.Router()

adminRoute
.put("/updateequipmentrequest/:id",adminAuth,tryCatch(updaterequest))



export default adminRoute