
import express from "express";
import tryCatch from "../utils/tryCatch";
import { addEvent, getEvents,getEventById, editEvents, deleteEvent } from "../Controller/Admin controllers/adminController";
import { upload } from "../Middleware/ImageUpload";

const eventRoutes=express.Router()

eventRoutes
.post('/addevents',upload.single("image"),tryCatch(addEvent))
.get('/getevents',tryCatch(getEvents))
.get('/geteventbyid/:id',tryCatch(getEventById))
.put('/editevent/:id',upload.single("image"),tryCatch(editEvents))
.post('/deleteEvent/:id',tryCatch(deleteEvent))
export default eventRoutes