import express from 'express'
import tryCatch from '../utils/tryCatch'
import { blockUser, getblockedUsers, getUserById, getUsers } from '../Controller/User Controllers/userController'

const userRoutes=express.Router()

userRoutes
.get('/getUsers',tryCatch( getUsers))
.get('/getUserById/:_id',tryCatch(getUserById))
.get('/getblockedUsers',tryCatch(getblockedUsers))
.post('/blockUser/:_id',tryCatch(blockUser))
export default  userRoutes;
