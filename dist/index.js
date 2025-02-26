"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = __importDefault(require("./utils/CustomError"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./Routes/authRoutes"));
const doctorRoutes_1 = __importDefault(require("./Routes/doctorRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const EventRoutes_1 = __importDefault(require("./Routes/EventRoutes"));
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const EquipmentRoute_1 = __importDefault(require("./Routes/EquipmentRoute"));
const volonteersRoutes_1 = __importDefault(require("./Routes/volonteersRoutes"));
const ErrorHandler_1 = __importDefault(require("./Middleware/ErrorHandler"));
const donorsRoutes_1 = __importDefault(require("./Routes/donorsRoutes"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes"));
const donetionRoutes_1 = __importDefault(require("./Routes/donetionRoutes"));
const socket_1 = require("./socket/socket");
dotenv_1.default.config();
const authRoute = authRoutes_1.default;
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
const corsOptions = {
    origin: process.env.FRONTENT_URI,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', "X-MongoDb-Id"],
    credentials: true,
};
socket_1.app.use((0, cors_1.default)(corsOptions));
socket_1.app.use(express_1.default.json());
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use(express_1.default.urlencoded({ extended: true }));
socket_1.app.use("/api/auth", authRoute);
socket_1.app.use("/api/doctors", doctorRoutes_1.default);
socket_1.app.use("/api/events", EventRoutes_1.default);
socket_1.app.use("/api/equipment", EquipmentRoute_1.default);
socket_1.app.use("/api/users", userRoutes_1.default);
socket_1.app.use("/api/volunteers", volonteersRoutes_1.default);
socket_1.app.use("/api/donors", donorsRoutes_1.default);
socket_1.app.use("/api/admin", adminRoutes_1.default);
socket_1.app.use("/api/donation", donetionRoutes_1.default);
socket_1.app.use(ErrorHandler_1.default);
socket_1.app.all('*', (req, res, next) => {
    const err = new CustomError_1.default(`cannot ${req.method} ${req.originalUrl}`, 404);
    next(err);
});
const PORT = process.env.PORT || 5000;
socket_1.server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
