import mongoose,{Document,ObjectId,Schema} from "mongoose";

interface RequestType extends Document{
    user:ObjectId,
    equipment:ObjectId,
    location:string,
    status:Enumerator
}

const RequestSchema:Schema<RequestType>=new Schema({
    user:{
        type: mongoose.Types.ObjectId,ref: "User", 
        required: true,
    },
    equipment:{
        type:mongoose.Types.ObjectId,ref:"Equipment",
        required:true
    },
    location:{
        type:String,
        required:true
    },
    status:{
        type:String,enum:["pending","accepted","deliverd","cancell"]
    }
})

const Request = mongoose.model<RequestType>("Request",RequestSchema)
export default Request