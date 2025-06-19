import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadImage = async (filePath) => {
    try {
        if (!filePath) return null;

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        console.log('✅ Image uploaded to Cloudinary:', result.url);

        // Remove local file
        fs.unlinkSync(filePath);
        //console.log('Temporary file deleted:', filePath);

        return result;
    } catch (error) {
        
       fs.unlinkSync(filePath); // Ensure the file is deleted even if upload fails
       console.error('❌ Error uploading image to Cloudinary:', error);
       return null;
    }
};

export { uploadImage };
