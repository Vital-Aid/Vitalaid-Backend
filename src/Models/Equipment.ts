import mongoose ,{Document,Schema} from "mongoose";

interface EquipmentType extends Document{
    name: string,
    image:string,
    quantity:number,
    description:string,
    isDeleted:boolean
} 

const Equipmentschema :Schema <EquipmentType>=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

}
,{timestamps:true}
)

const Equiment =mongoose.model<EquipmentType>("Equipment",Equipmentschema)
export default Equiment