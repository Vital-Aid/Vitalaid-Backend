import express from "express";
import tryCatch from "../utils/tryCatch";
import { getDoctersById, getDoctors } from "../Controller/User Controllers/doctorController";
import { adminAuth, doctorAuth, userAuth } from "../Middleware/authMiddleware";
import { upload } from "../Middleware/ImageUpload";
import { addDetails, deleteDr, editDetails, getdrDetails } from "../Controller/Admin controllers/doctorControll";


const routes = express.Router()

routes
    .get('/getdoctors', adminAuth, tryCatch(getDoctors))
    .get('/getDoctorsById/:id', doctorAuth, tryCatch(getDoctersById))
    .post("/postdetailsof", adminAuth,upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "certificates", maxCount: 5 }]), tryCatch(addDetails))
    .get("/getDetailsof/:id",tryCatch(getdrDetails))
    .get("/getdetail/id" ,userAuth, tryCatch(getdrDetails))
    .put("/editdetailsof/:id",adminAuth,upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "certificates", maxCount: 5 }]),tryCatch(editDetails))
    .put("/deletedr/:id",adminAuth,tryCatch(deleteDr))

export default routes
