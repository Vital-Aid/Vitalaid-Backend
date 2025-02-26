"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const doctorController_1 = require("../Controller/User Controllers/doctorController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const ImageUpload_1 = require("../Middleware/ImageUpload");
const doctorControll_1 = require("../Controller/Admin controllers/doctorControll");
const userController_1 = require("../Controller/User Controllers/userController");
const ReviewController_1 = require("../Controller/User Controllers/ReviewController");
const routes = express_1.default.Router();
routes
    .get('/getdoctors', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(doctorController_1.getDoctors))
    .get('/getAllDoctors', authMiddleware_1.userAuth, (0, tryCatch_1.default)(doctorControll_1.getallDetails))
    .get('/getDoctorsById/:id', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(doctorController_1.getDoctersById))
    .get('/getDoctorById/:id', (0, tryCatch_1.default)(doctorController_1.getDoctersById))
    .post("/postdetailsof", authMiddleware_1.adminAuth, (0, tryCatch_1.default)(doctorControll_1.addDetails))
    .get("/getDetailsof/:id", authMiddleware_1.adminAuth, (0, tryCatch_1.default)(doctorControll_1.getdrDetails))
    .get("/getdetail/:id", (0, tryCatch_1.default)(doctorControll_1.getdrDetails)) //
    .put("/editdetailsof/:id", authMiddleware_1.adminAuth, ImageUpload_1.upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "certificates", maxCount: 5 }]), (0, tryCatch_1.default)(doctorControll_1.editDetails))
    .put("/deletedr/:id", authMiddleware_1.adminAuth, (0, tryCatch_1.default)(doctorControll_1.deleteDr))
    .get("/getdoctorsprofile", authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorController_1.getDoctersByIdfordoctor))
    .post("/addtokenperday", authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorControll_1.addtokenPerDay))
    .get("/alltoken/:id", authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorController_1.getallTokens))
    .get("/getdoctorsprofile", authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorController_1.getDoctersByIdfordoctor))
    .get('/tokensofeachdoctors', authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorController_1.getallTokensofEachDoctor))
    .put('/updatetoken/:id', authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorController_1.editTokenStatus))
    .put('/updateavailability', authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorController_1.editAvailability))
    .get('/searchDoctors', (0, tryCatch_1.default)(doctorController_1.searchDoctors))
    .post('/adddatetokennumber', authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorControll_1.addtokenPerDay))
    .put('/updatetokennumber', authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(doctorControll_1.edittokenPerDay))
    .get("/getallreview", authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(userController_1.getReview))
    .get('/getUserById/:id', authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(userController_1.getUserById))
    .post("/adduserreview", authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(ReviewController_1.adduserReview))
    .get("/getuserreview/:id", authMiddleware_1.doctorAuth, (0, tryCatch_1.default)(ReviewController_1.getUsersReview));
exports.default = routes;
