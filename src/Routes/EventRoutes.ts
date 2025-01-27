
import express from "express";
import tryCatch from "../../utils/tryCatch";
import { addEvent, getEvents,getEventById } from "../Controller/adminController";


const eventRoutes=express.Router()

eventRoutes
.post('/addevents',tryCatch(addEvent))
.get('/getevents',tryCatch(getEvents))
.get('/geteventbyid/:id',tryCatch(getEventById))

export default eventRoutes