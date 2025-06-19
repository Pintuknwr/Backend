import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import { uploadImage } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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

export {registerUser};



