import mongoose, { Document, Schema } from "mongoose";

interface DrDetailsType extends Document {
    doctor: mongoose.ObjectId,
    qualification: string[],
    specialization: string,
    availablity: string[],
    profileImage: string,
    description: string,
    address: string,
    cirtificate: string[]
}

const DrDetailschema: Schema<DrDetailsType> = new Schema({
    doctor: {
        type: mongoose.Types.ObjectId, ref: "Doctor",
        required: true
    },
    qualification: {
        type: [String],
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    availablity: {
        type: [String]
    },
    profileImage: {
        type: String
    },
    description: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    cirtificate: {
        type: [String]
    }

},
    { timestamps: true }

)

const DrDetails=mongoose.model<DrDetailsType>("DoctorDeatails",DrDetailschema)
export default DrDetails

