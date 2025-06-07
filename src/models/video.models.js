import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,  // Path to the video file from cloudinary
        required: true,
    },
    thumbnail: {
        type: String,  //cloudinary
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        
    },
    duration: {
        type: Number,  // cloudinary duration in seconds
        required: [true, 'Duration is required']
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",  // Reference to the User model
    }









},{timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);



export const Video = mongoose.model("Video",videoSchema);