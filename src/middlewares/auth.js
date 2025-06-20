import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token=req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ","")
        if (!token) {
            return res.status(401).json({ message: "Access token is required" });
        }
        const decodedToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            // Frontend Discussion
            throw new ApiError(401, "Unauthorized access");
        }
    
        req.user = user;
        next();
    } catch (error) {
        new ApiError(401, "Unauthorized access");
    }
    
})
