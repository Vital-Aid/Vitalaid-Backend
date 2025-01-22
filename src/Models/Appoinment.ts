import mongoose, { Document, Schema } from "mongoose";

interface AppoinmentType extends Document {
    user: mongoose.ObjectId,
    doctor: mongoose.ObjectId,
    date: string,
    time: string,
    status: Enumerator,
    location: string
}


const Appoinmentschema: Schema<AppoinmentType> = new Schema({
    user: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true
    },
    doctor: {
        type: mongoose.Types.ObjectId, ref: "Doctor",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    },
    location: {
        type: String
    }

},
    { timestamps: true }
)

const Appoinment = mongoose.model<AppoinmentType>("Appoinment",Appoinmentschema)
export default Appoinment