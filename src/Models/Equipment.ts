import mongoose ,{Document,Schema} from "mongoose";

interface EquipmentType extends Document{
    name: String,
    image:String,
    quantity:Number,
    description:String
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
    }

}
,{timestamps:true}
)

const Equiment =mongoose.model<EquipmentType>("Equipment",Equipmentschema)
export default Equiment