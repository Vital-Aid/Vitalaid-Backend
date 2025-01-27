
import express from "express";
import tryCatch from "../utils/tryCatch";
import { addEvent, getEvents,getEventById } from "../Controller/adminController";
import { upload } from "../Middleware/ImageUpload";

const eventRoutes=express.Router()

eventRoutes
.post('/addevents',upload.single("image"),tryCatch(addEvent))
.get('/getevents',tryCatch(getEvents))
.get('/geteventbyid/:id',tryCatch(getEventById))

export default eventRoutes