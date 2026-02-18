import mongoose from "mongoose";

export const connectDb = async ()=>{
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log('db connected',response.connection.host);
    } catch (error) {
        console.log(`unable to connect db due to ${error}`);
    }
}