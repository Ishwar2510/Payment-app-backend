import * as dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
const PORT = 8001

async function connect(){
try{
    await mongoose.connect(process.env.DB)
    console.log("connection successfull")
}catch (err){
    console.log(err)
}


}

export default connect

