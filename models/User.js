import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contactNumber:{
        type :Number,
        unique:true
    },
    bank:[{
        name:String,
        amount:Number,
        isPrimary:false 
    }]
})
userSchema.methods.getBankBalance=async function(){
    return this.bank.reduce((a,b)=>{return a.amount+b.amount},{amount:0})
}
const User = new mongoose.model("User",userSchema);


export default User;