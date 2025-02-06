
import express from "express";
import tryCatch from "../utils/tryCatch";
import { addEvent, getEvents, getEventById, editEvents, deleteEvent } from "../Controller/Admin controllers/adminController";
import { upload } from "../Middleware/ImageUpload";
import { adminAuth } from "../Middleware/authMiddleware";

const eventRoutes = express.Router()

eventRoutes

    .post('/addevents', adminAuth, tryCatch(addEvent))
    .get('/getevents', tryCatch(getEvents))
    .get('/geteventbyid/:id', tryCatch(getEventById))
    .put('/editevent/:id', adminAuth, upload.single("image"), tryCatch(editEvents))
    .post('/deleteEvent/:id', adminAuth, tryCatch(deleteEvent))


export default eventRoutes