import { v2 as cloudinary } from 'cloudinary';
import { fs } from 'fs';

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KYE, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadOnCloudinary = async (localfile) => {

        try {

             // Check if the file exists
             if (!fs.existsSync(localfile)) {
                 throw new Error('Local file not found');
             }
         // Upload the local file to Cloudinary
         const result = await cloudinary.uploader.upload(localfile,{
             resource_type: 'auto',
             quality: 'auto', // Use 'auto' for automatic quality
             transformation: [{
                 width: 500,
                 height: 500,
                 crop: 'fill',
                 gravity: 'faces'
             }] // Resize and crop to 200x200 pixels, keeping the face aspect ratio
         });
         console.log('Image uploaded to Cloudinary: ', result.url);
         return result.url;
     } catch (error) {
        fs.unlinkSync(localfiles);
         return null;
     }
    }


    export { uploadOnCloudinary}