import express from "express";
import tryCatch from "../utils/tryCatch";
import { upload } from "../Middleware/ImageUpload";
import { addDonor, deleteDoner, editDonors, getDonors, getDonorsById } from "../Controller/Admin controllers/bloodDonors";

const donnersRoutes=express.Router()

donnersRoutes
.post('/addDoners',upload.single("image"),tryCatch(addDonor))
.get('/getDonors',tryCatch(getDonors))
.get('/getDonorsById/:id',tryCatch(getDonorsById))
.put('/editDonors/:id',upload.single("image"),tryCatch(editDonors))
.post('/deleteDoner/:id',tryCatch(deleteDoner))
export default donnersRoutes