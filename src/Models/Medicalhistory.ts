import mongoose, { Document, Schema } from "mongoose";



interface MedHistoryType extends Document {
    User: mongoose.ObjectId,
    report:string
    healthstatus:string
}

const MedHistoryschema: Schema<MedHistoryType> = new Schema({
    User: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true
    },

    report:{type:String},
    healthstatus:{type:String}
},
    { timestamps: true }
)

const MedHistory = mongoose.model<MedHistoryType>("MedicalHistory",MedHistoryschema)
export default MedHistory
