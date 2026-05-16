import mongoose from "mongoose";
import dotnet from 'dotenv'
dotnet.config();
const MONGO_URL = process.env.MONGO_URL
const connection = async()=>{
    try {
        await mongoose.connect(MONGO_URL)
        console.log('DB is connected');
    } catch (error) {
        console.log('DB is not connected');       
    }
}
export default connection