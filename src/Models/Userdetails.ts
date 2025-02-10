import mongoose, { Document, Schema } from "mongoose";

interface detailType extends Document {
    user: mongoose.ObjectId,
    age: string,
    occupation: string
    address: string
    gender:Enumerator
    bloodgroup:Enumerator
}

const userDetailsschema: Schema<detailType> = new Schema({
    user: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true
    },
    age: { type: String },
    occupation: { type: String },
    address: { type: String },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    bloodgroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
})

const UserDetails = mongoose.model<detailType>("UserDetails", userDetailsschema)
export default UserDetails