import mongoose ,{Document,Schema} from "mongoose";

interface VolunteerType extends Document {
    name: string,
    phone:number,
    gender:Enumerator,
    isDeleted:Boolean
}

const volunteerschema:Schema<VolunteerType>= new Schema(
    {
        name:{
            type:String,
            default:"",
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        gender:{
            type:String,enum:["male","female"]
        },
        isDeleted:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
)

const Volunteer= mongoose.model <VolunteerType>("Volonteer",volunteerschema)
export default Volunteer