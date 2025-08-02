import mongoose, { Document, Schema } from "mongoose";

interface MessageType extends Document {
  senderId: mongoose.Schema.Types.ObjectId;
  senderModel: "User" | "Doctor";
  receiverId: mongoose.Schema.Types.ObjectId;
  receiverModel: "User" | "Doctor";
  message: string;
}

const ChatSchema: Schema<MessageType> = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: { type: String, required: true, enum: ["User", "Doctor"] },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: { type: String, required: true, enum: ["User", "Doctor"] },

    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<MessageType>("Chat", ChatSchema);
