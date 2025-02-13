import mongoose, { ObjectId, Schema } from "mongoose";

interface totalToken{
    doctorId:ObjectId
    tokenPerDay:number
   
}

const TotalTokenSchema:Schema<totalToken>=new Schema({
    doctorId:{type:mongoose.Types.ObjectId,ref:"Doctor",required:true},
    tokenPerDay:{type:Number,required:true},
    
})
const TokenPerDay=mongoose.model<totalToken>("TokenPerDay",TotalTokenSchema)
export default TokenPerDay