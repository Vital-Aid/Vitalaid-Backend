import mongoose,{Document,Schema} from "mongoose";

interface EventType extends Document{
    title:string,
    description:string,
    date:string,
    image:string[],
    location:string,
    organization:string,
    isDeleted: boolean; 
}

const Eventschema: Schema<EventType> = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
    image: {
        type: [String],
    },
    location: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
    },
    isDeleted: {
        type: Boolean, 
        default: false,
    },
});


const Event =mongoose.model<EventType>("Event",Eventschema)
export default Event