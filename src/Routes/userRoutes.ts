import express from 'express'
import tryCatch from '../utils/tryCatch'
import { getUserById, getUsers } from '../Controller/User Controllers/userController'

const userRoutes=express.Router()

userRoutes
.get('/getUsers',tryCatch( getUsers))
.get('/getUserById/:_id',tryCatch(getUserById))
export default  userRoutes;
