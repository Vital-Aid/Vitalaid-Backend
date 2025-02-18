import express from "express";
import tryCatch from "../utils/tryCatch";
import { editAvailability, editTokenStatus, getDoctersById, getDoctersByIdfordoctor, getDoctors, getallTokens, getallTokensofEachDoctor, searchDoctors } from "../Controller/User Controllers/doctorController";
import { adminAuth, doctorAuth, userAuth } from "../Middleware/authMiddleware";
import { upload } from "../Middleware/ImageUpload";
import { addDetails, addtokenPerDay, deleteDr, editDetails, getallDetails, getdrDetails, gettokenNumber } from "../Controller/Admin controllers/doctorControll";




const routes = express.Router()

routes

    .get('/getdoctors', adminAuth, tryCatch(getDoctors))
    .get('/getAllDoctors', userAuth, tryCatch(getallDetails))

    .get('/getDoctorsById/:id', adminAuth, tryCatch(getDoctersById))
    .get('/getDoctorById/:id', tryCatch(getDoctersById))

    .post("/postdetailsof", adminAuth,  tryCatch(addDetails))
    .get("/getDetailsof/:id", adminAuth, tryCatch(getdrDetails))
    .get("/getdetail/:id", tryCatch(getdrDetails))//
    .put("/editdetailsof/:id", adminAuth, upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "certificates", maxCount: 5 }]), tryCatch(editDetails))
    .put("/deletedr/:id", adminAuth, tryCatch(deleteDr))
    .get("/getdoctorsprofile", doctorAuth, tryCatch(getDoctersByIdfordoctor))
    .post("/addtokenperday", doctorAuth, tryCatch(addtokenPerDay))
    .get("/alltoken/:id", doctorAuth, tryCatch(getallTokens))
    .get("/getdoctorsprofile", doctorAuth, tryCatch(getDoctersByIdfordoctor))
    .get('/tokensofeachdoctors', doctorAuth, tryCatch(getallTokensofEachDoctor))
    .put('/updatetoken/:id', doctorAuth,tryCatch(editTokenStatus))
    .put('/updateavailability',doctorAuth,tryCatch(editAvailability))
    .get('/searchDoctors',tryCatch(searchDoctors))
export default routes
