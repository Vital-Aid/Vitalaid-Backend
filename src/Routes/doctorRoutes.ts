import express from "express";
import tryCatch from "../utils/tryCatch";
import { addSlotes, getDoctersById, getDoctersByIdfordoctor, getDoctors, getSlots } from "../Controller/User Controllers/doctorController";
import { adminAuth, doctorAuth, userAuth } from "../Middleware/authMiddleware";
import { upload } from "../Middleware/ImageUpload";
import { addDetails, deleteDr, editDetails, getallDetails, getdrDetails } from "../Controller/Admin controllers/doctorControll";


const routes = express.Router()

routes

    .get('/getdoctors', adminAuth, tryCatch(getDoctors))
    .get('/getAllDoctors',userAuth, tryCatch(getallDetails))

    .get('/getDoctorsById/:id', adminAuth, tryCatch(getDoctersById))
    .get('/getDoctorById/:id', tryCatch(getDoctersById))

    .post("/postdetailsof", adminAuth,upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "certificates", maxCount: 5 }]), tryCatch(addDetails))
    .get("/getDetailsof/:id",adminAuth,tryCatch(getdrDetails))
    .get("/getdetail/:id" , tryCatch(getdrDetails))//
    .put("/editdetailsof/:id",adminAuth,upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "certificates", maxCount: 5 }]),tryCatch(editDetails))
    .put("/deletedr/:id",adminAuth,tryCatch(deleteDr))
    .get("/getdoctorsprofile",doctorAuth,tryCatch(getDoctersByIdfordoctor))
    .post('/addslot',doctorAuth,tryCatch(addSlotes))
    .get('/getslots',doctorAuth,tryCatch(getSlots))
export default routes
