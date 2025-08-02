import express from "express";
import tryCatch from "../utils/tryCatch";
import { allDonations, createOrder, getAllDonations, getAllDonationsById, getUserReceipt, verifyPayment } from "../Controller/User Controllers/create-donation";

const routes = express.Router()

routes
.post('/createOrder',tryCatch(createOrder))
.post('/verifyPayment',tryCatch(verifyPayment))
.get('/allDonations',tryCatch(allDonations))
.get('/getAllDonations',tryCatch(getAllDonations))
.get('/getUserReceipt/:userId',tryCatch(getUserReceipt))
.get('/getAllDonationsById/:userId',tryCatch(getAllDonationsById))
export default routes