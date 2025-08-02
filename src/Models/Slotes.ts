import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISlot extends Document {
    date: string;
    startingTme:string;
    endingTime: string;
    isDeleted: boolean;
    doctor: Types.ObjectId;
}

const SlotSchema = new Schema<ISlot>(
    {
        doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
        startingTme:{type:String,required:true},
        endingTime: { type: String, required: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Slot = mongoose.model<ISlot>("Slot", SlotSchema);
export default Slot;
