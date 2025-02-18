import express from "express";
import tryCatch from "../utils/tryCatch";
import { adminAuth, doctorAuth, userAuth } from "../Middleware/authMiddleware";
import { allDonations, createOrder, verifyPayment } from "../Controller/User Controllers/create-donation";

const routes = express.Router()

routes
.post('/createOrder',tryCatch(createOrder))
.post('/verifyPayment',tryCatch(verifyPayment))
.get('/allDonations',tryCatch(allDonations))
export default routes