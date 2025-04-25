import express from "express";
import tryCatch from "../utils/tryCatch";
import { editAvailability, editTokenStatus, getDoctersById, getDoctersByIdfordoctor, getDoctors, getReviewForDoctors, getallTokens, getallTokensofEachDoctor, searchDoctors } from "../Controller/User Controllers/doctorController";
import { adminAuth, doctorAuth, userAuth } from "../Middleware/authMiddleware";
import { upload } from "../Middleware/ImageUpload";
import { addDetails, addtokenPerDay, deleteDr, editDetails, edittokenPerDay, getallDetails, getdrDetails, gettokenNumber } from "../Controller/Admin controllers/doctorControll";
import {  getUserById } from "../Controller/User Controllers/userController";
import { adduserReview, getReview, getUsersReview } from "../Controller/User Controllers/ReviewController";


const routes = express.Router()

routes

    .get('/getdoctors', adminAuth, tryCatch(getDoctors))
    .get('/getAllDoctors', tryCatch(getallDetails))
    .get('/getDoctorsById/:id', adminAuth, tryCatch(getDoctersById))
    .get('/getDoctorById/:id', tryCatch(getDoctersById))
    .post("/postdetailsof", adminAuth,  tryCatch(addDetails))
    .get("/getDetailsof/:id", adminAuth, tryCatch(getdrDetails))
    .get("/getdetail/:id", tryCatch(getdrDetails))
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
    .post('/adddatetokennumber',doctorAuth,tryCatch(addtokenPerDay))
    .put('/updatetokennumber',doctorAuth,tryCatch(edittokenPerDay))
    .get("/getallreview",doctorAuth,tryCatch(getReviewForDoctors))
    .get('/getUserById/:id',doctorAuth, tryCatch(getUserById))
    .post("/adduserreview",doctorAuth,tryCatch(adduserReview))
    .get("/getuserreview/:id",doctorAuth,tryCatch(getUsersReview))


export default routes
