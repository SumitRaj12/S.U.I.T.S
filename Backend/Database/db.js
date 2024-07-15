import mongoose from 'mongoose';
import { config } from 'dotenv';
config()

const connection=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected");
    }
    catch(err){
        console.log("Error occured "+err);
    }
}
export default connection;