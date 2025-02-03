import express from 'express'
import { adminAuth } from '../Middleware/authMiddleware'
import tryCatch from '../utils/tryCatch'
import { addVolunteers, deleteVolunteers, editvolunteers, getVolunteers, getvolonteersById } from '../Controller/Admin controllers/volunteersControllers'
import { upload } from '../Middleware/ImageUpload'
const volunteerRoute=express.Router()

volunteerRoute
.post('/add',adminAuth,upload.single('image'),tryCatch(addVolunteers))
.get('/getall',tryCatch(getVolunteers))
.get('/getbyid/:id',tryCatch(getvolonteersById))
.put('/edit/:id',adminAuth,upload.single('image'),tryCatch(editvolunteers))
.put('/delete/:id',adminAuth,tryCatch(deleteVolunteers))


export default volunteerRoute