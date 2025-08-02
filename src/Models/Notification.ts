import mongoose, { Document, Schema } from "mongoose";

interface NotificationType extends Document {
    message: string,
    date: Date,
    sentBy: string
}

const Notificationschema: Schema<NotificationType> = new Schema({
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    sentBy: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const Notification =mongoose.model<NotificationType>("Notification",Notificationschema)
export default Notification