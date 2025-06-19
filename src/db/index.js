import mongoose from "mongoose";

import {DB_NAME} from "../constants.js";

const connectDB =async () =>{
    try{
        const dbconnection=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected: ${dbconnection.connection.host} on ${DB_NAME} database`);

    }
    catch(error){
        console.error("Error connecting to the database: ", error);
        throw error;
    }
}

export default connectDB;
