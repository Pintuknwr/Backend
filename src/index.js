import dotenv from "dotenv";

import connectDB from "./db/index.js";

dotenv.config({
    path: "./config.env"
});

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,() =>{
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    }

    )

}).catch(()=>{
    console.error("Failed to connect to the database:", error);
    process.exit(1);
})


// import express from "express";

// const app= express();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error)=>{
//             console.log("Error: ",error)
//             throw error;
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`Server is running on port ${process.env.PORT}`);

//         })
//     } catch (error) {
//         console.error("Error ", error);
//         process.exit(1);
//     }
// };

// export default connectDB;