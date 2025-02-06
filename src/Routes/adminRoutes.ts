
import express from 'express'
import tryCatch from "../utils/tryCatch";
import { adminAuth } from '../Middleware/authMiddleware';
import { updaterequest } from '../Controller/User Controllers/userEquipmentController';
import { searchEquipments, searchvolunteer } from '../Controller/searchController';



const adminRoute=express.Router()

adminRoute
.put("/updateequipmentrequest/:id",adminAuth,tryCatch(updaterequest))
.get("/searchvolunteer",adminAuth,tryCatch(searchvolunteer))
.get('/searchequipments',adminAuth,tryCatch(searchEquipments))


export default adminRoute