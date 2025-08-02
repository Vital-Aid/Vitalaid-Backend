import express from 'express'
import tryCatch from '../utils/tryCatch'
import { upload } from '../Middleware/ImageUpload'
import { adminAuth } from '../Middleware/authMiddleware'
import { addEquipment, deleteEquipments, editEquipments, getAllEquipments, getEquipmentBYId } from '../Controller/Admin controllers/equipmentControllers'
import { totalEquipment } from '../Controller/User Controllers/userEquipmentController'
const equipmentRoute = express.Router()


equipmentRoute

    .post('/addequipment', adminAuth, tryCatch(addEquipment))
    .get('/getequipments', adminAuth, tryCatch(getAllEquipments))
    .get('/getequipment/:id', tryCatch(getEquipmentBYId))
    .put('/editEquipment/:id', adminAuth, upload.single('image'), tryCatch(editEquipments))
    .put('/deleteEquipment/:id', adminAuth, tryCatch(deleteEquipments))
    .get("/getTotalCount",tryCatch(totalEquipment))


export default equipmentRoute
