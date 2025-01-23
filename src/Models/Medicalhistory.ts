import mongoose, { Document, Schema } from "mongoose";


interface MedHistoryType extends Document {
    User: mongoose.ObjectId,
    age: number,
    gender: Enumerator,
    bloodgroup: Enumerator,
    alergy: string,
    healthstatus: number,
    pressure: string,
    sugar: string,
    cholestrol: string,
    otherDesease: string,
    height: string,
    weight: string,
    about: string
}

const MedHistoryschema: Schema<MedHistoryType> = new Schema({
    User: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    bloodgroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    alergy: {
        type: String
    },
    healthstatus: {
        type: Number
    },
    pressure: {
        type: String
    },
    sugar: {
        type: String
    },
    cholestrol: {
        type: String
    },
    otherDesease: {
        type: String
    },
    height: {
        type: String
    },
    weight: {
        type: String
    },
    about: {
        type: String
    }


},
    { timestamps: true }
)

const MedHistory = mongoose.model<MedHistoryType>("MedicalHistory",MedHistoryschema)
export default MedHistory
