import mongoose, { Document, Schema } from "mongoose";

interface DonationType extends Document {
  name: string;
  amount: number;
  date: Date;
  paymentId: string;
  orderId: string;
  status: string;
  user: mongoose.ObjectId;
  type: string;
  paymentMethod?: string;

}

const DonationSchema: Schema<DonationType> = new Schema({
  // name:{
  //     type:String,
  //     required:true
  // },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { type: String, required: true },
  amount: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  orderId: { type: String, required: true },
  status: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: { type: String },

});

const Donation = mongoose.model<DonationType>("Donation", DonationSchema);

export default Donation;
