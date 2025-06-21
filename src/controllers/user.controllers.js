import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadImage } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens=async(userId)=>{
    // This function can be used to generate access and refresh tokens if needed
    try{
        const user=await User.findById(userId)
        if(!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // Save the refresh token in the user document in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });


        return { accessToken, refreshToken };
    }
    catch(error) {
        throw new ApiError(500," Error generating tokens");

        
}
}
const registerUser = asyncHandler(async (req, res) => {
    // Registration logic here
    const {username,email,password,fullname} =req.body
    console.log(email);

    if(!username || !email || !password || !fullname) {
        throw new ApiError(400, "All fields are required");
    }
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    

    

    // If avatar or coverImage is provided, handle file upload
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path

    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //console.log("Avatar Local Path:", avatarLocalPath);

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required for registration");
    }


    // Upload avatar image to Cloudinary
    const avatar = await uploadImage(avatarLocalPath);
    const coverImage = await uploadImage(coverImageLocalPath);
    
    


    if(!avatar){
        throw new ApiError(400, "Avatar image is required or upload failed");
    }

   // Create new user
    const newUser = await User.create({
        username,
        email,
        password,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

   // Exclude password and refreshToken from the response
   const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

   if(!createdUser) {
        throw new ApiError(500, "User creation failed");
    }

    // Return success response

    return res.status(201).json(
        new ApiResponse(200, "User registered successfully", createdUser)
    );
});

const loginUser = asyncHandler(async(req,res)=>{
    // Login logic here
    const {email, password} = req.body;
    if(!email ||  !password) {
        throw new ApiError(400, "Email and password are required");
    }
    // Find user by email
    const user =await User.findOne({ 
        $or: [{ email}]
    })
    if(!user) {
        throw new ApiError(404, "User not found");
    }
    // Check password
    const isPasswordValid= await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate and return JWT token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Exclude password and refreshToken from the response
    const userResponse = await User.findById(user._id).select("-password -refreshToken");

    // send cookies
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, "User logged in successfully", {user: userResponse, accessToken, refreshToken}));

   
});

const logoutUser = asyncHandler(async (req,res) =>{
    User.findByIdAndUpdate(req.user._id,{
        $set: {
            refreshToken: undefined

        }
    },
    {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
        





})

const refreshAccessToken = asyncHandler (async(req,res)=>{
    const incomingRefreshToken=req.cookie.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")

    }
    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken!== user.refreshToken){
            throw new ApiError(401,"Refresh token is expired")
        }
    
        const options ={
            httpOnly: true,
            secure: true,
        }
       const {accessToken,newrefreshToken}= await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("access Token",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(new ApiResponse(200,{
            accessToken,newrefreshToken
        },"Access Token refreshed"))
    
    
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid")
        
    }


})

export {registerUser, loginUser,logoutUser,refreshAccessToken};



