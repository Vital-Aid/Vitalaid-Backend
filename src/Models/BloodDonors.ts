import mongoose,{Document,Schema} from "mongoose";

interface DonorType extends Document {
    name:String,
    BloodGroup:String,
    Phone:Number,
    Gender:Enumerator,
    Age:Number,
    Address:String

}

const BloodDonorschema:Schema <DonorType>= new Schema({
    name:{
        type:String,
        default:"",
        required:true
    },
    BloodGroup:{
        type:String,
        required:true
    },
    Phone:{
        type:Number,
        required:true
    },
    Gender: {
        type:String,enum:["male","female"],
        required:true
    },
    Age:{
        type:Number,
        required:true
    },
    Address:{
        type:String,
        required:true
    }
})

const BloodDonor= mongoose.model<DonorType>("BloodDonor",BloodDonorschema)
export default BloodDonor