import { tokenType } from "aws-sdk/clients/sts";
import mongoose, { ObjectId, Schema } from "mongoose";
import { string } from "zod";

type statusType="pending"|"cancelled"|"Completed"
interface tokentype extends Document{
    patientId:ObjectId
    doctorId:ObjectId
    date:string
    status:statusType
    tokenNumber:number
}

const tokenSchema:Schema<tokentype>=new Schema({
        patientId:{type:mongoose.Types.ObjectId,ref:'User',
                    required:true},
        doctorId:{type:mongoose.Types.ObjectId,ref:'Doctor',required:true},
        date:{type:String,required:true},
        status:{
            type:String,
            enum:["pending","cancelled","Completed"],
            default:"pending"
           
        },
        tokenNumber:{type:Number,required:true}

        
        
})
const Token=mongoose.model<tokentype>("Token",tokenSchema)
export default Token