import mongoose, { Document, ObjectId, Schema } from "mongoose";

interface messageType extends Document {
  message: string;
  todoctor: boolean;
}

const MessageSchema: Schema<messageType> = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    todoctor: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const Message = mongoose.model<messageType>("Message", MessageSchema);
export default Message;
