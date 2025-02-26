"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDonationsById = exports.getUserReceipt = exports.getAllDonations = exports.allDonations = exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const Donation_1 = __importDefault(require("../../Models/Donation"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt#${Math.random() * 1000}`,
        notes: {
            note1: "Donation for VitalAid",
        },
    };
    razorpay.orders.create(options, (err, order) => {
        if (err) {
            const error = err;
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    });
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId, orderId, signature, type, userId } = req.body;
    console.log(req.body);
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    const generatedSignature = hmac
        .update(orderId + "|" + paymentId)
        .digest("hex");
    console.log("2,", generatedSignature);
    if (generatedSignature === signature) {
        const donation = new Donation_1.default({
            amount: req.body.amount,
            paymentId: paymentId,
            orderId: orderId,
            status: "success",
            type: type,
            user: userId,
        });
        yield donation.save();
        console.log("4", donation);
        res.status(200).json({
            success: true,
            message: "Payment verified successfully!",
        });
        return;
    }
    else {
        res
            .status(400)
            .json({ success: false, message: "Payment verification failed!" });
        return;
    }
});
exports.verifyPayment = verifyPayment;
const allDonations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const generalTotal = yield Donation_1.default.aggregate([
        { $match: { type: "general", status: "success" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const equipmentTotal = yield Donation_1.default.aggregate([
        { $match: { type: "equipment", status: "success" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalGeneral = generalTotal.length > 0 ? generalTotal[0].totalAmount : 0;
    const totalEquipment = equipmentTotal.length > 0 ? equipmentTotal[0].totalAmount : 0;
    const totalDonation = totalGeneral + totalEquipment;
    res.status(200).json({
        success: true,
        message: "Payment verified successfully!",
        totalDonations: {
            general: totalGeneral,
            equipment: totalEquipment,
            total: totalDonation,
        },
    });
});
exports.allDonations = allDonations;
const getAllDonations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield Donation_1.default.find()
        .populate("user", "name email phone")
        .sort({ createdAt: -1 });
    if (!donations) {
        return next(new CustomError_1.default("deatils not found", 404));
    }
    res.status(200).json({
        success: true,
        data: donations,
    });
});
exports.getAllDonations = getAllDonations;
const getUserReceipt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const donation = yield Donation_1.default.findOne({ user: userId })
        .populate("user", "name email phone")
        .sort({ date: -1 });
    if (!donation) {
        return next(new CustomError_1.default("deatils not found", 404));
    }
    res.status(200).json({
        success: true,
        data: donation,
    });
});
exports.getUserReceipt = getUserReceipt;
const getAllDonationsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const donation = yield Donation_1.default.find({ user: userId })
        .populate("user", "name email phone")
        .sort({ date: -1 });
    if (!donation) {
        return next(new CustomError_1.default("deatils not found", 404));
    }
    res.status(200).json({
        success: true,
        data: donation,
    });
});
exports.getAllDonationsById = getAllDonationsById;
