"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tryCatch_1 = __importDefault(require("../utils/tryCatch"));
const userController_1 = require("../Controller/User Controllers/userController");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const userEquipmentController_1 = require("../Controller/User Controllers/userEquipmentController");
const equipmentControllers_1 = require("../Controller/Admin controllers/equipmentControllers");
const reportControll_1 = require("../Controller/User Controllers/reportControll");
const zodValidation_1 = require("../Middleware/zodValidation");
const tokenValidation_1 = require("../Models/Validations/tokenValidation");
const doctorControll_1 = require("../Controller/Admin controllers/doctorControll");
const doctorController_1 = require("../Controller/User Controllers/doctorController");
const adminController_1 = require("../Controller/Admin controllers/adminController");
const messagecontroller_1 = require("../Controller/User Controllers/messagecontroller");
const ReviewController_1 = require("../Controller/User Controllers/ReviewController");
const userRoutes = express_1.default.Router();
userRoutes
    .get('/getUsers', (0, tryCatch_1.default)(userController_1.getUsers))
    .get('/getUserById/:id', authMiddleware_1.adminAuth, (0, tryCatch_1.default)(userController_1.getUserById))
    .get('/getblockedUsers', (0, tryCatch_1.default)(userController_1.getblockedUsers))
    .post('/blockUser/:_id', (0, tryCatch_1.default)(userController_1.blockUser))
    .post('/addrequest', authMiddleware_1.userAuth, (0, tryCatch_1.default)(userEquipmentController_1.makeRequest))
    .get('/userrequest', authMiddleware_1.userAuth, (0, tryCatch_1.default)(userEquipmentController_1.getRequestbyuser))
    .delete('/deleterequest/:equipment', authMiddleware_1.userAuth, (0, tryCatch_1.default)(userEquipmentController_1.removeRequest))
    .get('/getallequipment', authMiddleware_1.userAuth, (0, tryCatch_1.default)(equipmentControllers_1.getAllEquipments))
    .post("/addDetails/:id", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.addDetails))
    .get("/getdetails/:id", (0, tryCatch_1.default)(userController_1.getDetails))
    .post("/generatereport", (0, tryCatch_1.default)(reportControll_1.generateReport))
    .get("/getreportof/:id", (0, tryCatch_1.default)(reportControll_1.getReportbyid))
    .get('/getequipmentbyid/:id', authMiddleware_1.userAuth, (0, tryCatch_1.default)(equipmentControllers_1.getEquipmentBYId))
    .put('/cancellrequest/:id', authMiddleware_1.userAuth, (0, tryCatch_1.default)(userEquipmentController_1.updaterequest))
    .post("/sendmessage", (0, tryCatch_1.default)(adminController_1.newMessages))
    .post("/sendmsgtodr", (0, tryCatch_1.default)(adminController_1.msgtodr))
    .get("/getusermsg", (0, tryCatch_1.default)(adminController_1.getmsgusr))
    .post("/sendmsg", (0, tryCatch_1.default)(messagecontroller_1.postchat))
    .get("/messageof/:userId/:receiverId", (0, tryCatch_1.default)(messagecontroller_1.getmsgs))
    .get("/msgof/:doctorId", (0, tryCatch_1.default)(messagecontroller_1.getmessagedusers))
    .put("/editdetailsofthe", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.editDetails))
    .post('/createtoken', authMiddleware_1.userAuth, (0, zodValidation_1.validateData)(tokenValidation_1.tokenValidationSchema), (0, tryCatch_1.default)(userController_1.createToken))
    .put("/otpverification", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.otpVerification))
    .get("/gettokenperday/:id", authMiddleware_1.userAuth, (0, tryCatch_1.default)(doctorControll_1.gettokenNumber))
    .get("/getalltokens/:id", authMiddleware_1.userAuth, (0, tryCatch_1.default)(doctorController_1.getallTokens))
    .get("/getalltoken", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.getallTokenByUser))
    .put("/canceltoken/:id", authMiddleware_1.userAuth, (0, tryCatch_1.default)(doctorController_1.editTokenStatus))
    .post("/addreview", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.addReview))
    .get("/getallreview/:id", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.getReview))
    .put("/deletereview/:id", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.deleteReview))
    .get("/getalltokenofuser/:id", authMiddleware_1.userAuth, (0, tryCatch_1.default)(userController_1.getTokenByUser))
    .get("/getloginedCount", (0, tryCatch_1.default)(userController_1.getUsersUpdatedToday))
    .get("/getuserreview", authMiddleware_1.userAuth, (0, tryCatch_1.default)(ReviewController_1.getUsersReviewforusers));
exports.default = userRoutes;
