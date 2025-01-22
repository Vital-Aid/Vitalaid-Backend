import mongoose,{Document,Schema} from "mongoose";

interface DonationType extends Document{
    name:string,
    amount:number,
    date:Date
}

const DonationSchema:Schema<DonationType>=new Schema({
    name:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }

})

const Donation = mongoose.model <DonationType>("Donation",DonationSchema)

export default Donation
