import express from 'express'
import tryCatch from '../utils/tryCatch'
import { blockUser, getblockedUsers, getUserById, getUsers } from '../Controller/User Controllers/userController'
import { userAuth } from '../Middleware/authMiddleware'
import { getRequestbyuser, makeRequest, removeRequest } from '../Controller/User Controllers/userEquipmentController'
import { getAllEquipments } from '../Controller/Admin controllers/equipmentControllers'

const userRoutes = express.Router()

userRoutes

    .get('/getUsers', tryCatch(getUsers))
    .get('/getUserById/:_id', tryCatch(getUserById))
    .get('/getblockedUsers', tryCatch(getblockedUsers))
    .post('/blockUser/:_id', tryCatch(blockUser))
    .post('/addrequest', userAuth, tryCatch(makeRequest))
    .get('/userrequest', userAuth, tryCatch(getRequestbyuser))
    .delete('/deleterequest/:equipment', userAuth, tryCatch(removeRequest))
    .get('/getallequipment',userAuth,tryCatch(getAllEquipments))

export default userRoutes;
