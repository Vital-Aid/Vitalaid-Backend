import express from 'express'
import tryCatch from '../utils/tryCatch'
import {upload} from '../Middleware/ImageUpload'
import { adminAuth } from '../Middleware/authMiddleware'
import { addEquipment, deleteEquipments, editEquipments, getAllEquipments, getEquipmentBYId } from '../Controller/Admin controllers/equipmentControllers'
 const equipmentRoute=express.Router()


equipmentRoute
.post('/addequipment',upload.single("image"),tryCatch(addEquipment))
.get('/getequipments',adminAuth,tryCatch(getAllEquipments))
.get('/getequipment/:id',tryCatch(getEquipmentBYId))
.put('/editEquipment/:id',upload.single('image'),tryCatch(editEquipments))
.put('/deleteEquipment/:id',tryCatch(deleteEquipments))
export default equipmentRoute
