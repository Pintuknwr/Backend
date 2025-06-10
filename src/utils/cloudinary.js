import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (filePath) => {
    try {
        if(!filePath) return null; // Check if filePath is provided
        const result = await cloudinary.uploader.upload(filePath, {
            
            resource_type: 'auto' // Specify the resource type
        });

        fs.unlinkSync(filePath); // Delete the file after upload
        return result.secure_url; // Return the URL of the uploaded image
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}
