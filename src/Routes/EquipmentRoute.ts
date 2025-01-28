import express from 'express'
import tryCatch from '../utils/tryCatch'
import {upload} from '../Middleware/ImageUpload'
import { addEquipment, editEquipments, getAllEquipments, getEquipmentBYId } from '../Controller/Admin controllers/equipmentControllers'
 const equipmentRoute=express.Router()


equipmentRoute
.post('/addequipment',upload.single("image"),tryCatch(addEquipment))
.get('/getequipments',tryCatch(getAllEquipments))
.get('/getequipment/:id',tryCatch(getEquipmentBYId))
.put('/editEquipment/:id',upload.single('image'),tryCatch(editEquipments))

export default equipmentRoute
