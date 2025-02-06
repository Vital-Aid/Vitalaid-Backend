import mongoose, { Document, Schema } from "mongoose";

interface DrDetailsType extends Document {
    doctor: mongoose.ObjectId,
    qualification: string[],
    specialization: string[],
    availability: string,
    profileImage: string,
    description: string,
    address: string,
    certificates: string[]
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
        type: [String],
        required: true
    },
    availability: {
        type: String
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
    certificates: {
        type: [String]
    }

},
    { timestamps: true }

)

const DrDetails=mongoose.model<DrDetailsType>("DrDetails",DrDetailschema)
export default DrDetails

