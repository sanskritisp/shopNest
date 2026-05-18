import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";
import fs from 'fs';

const uploadOnCloudinary = async(imageLocalPath) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })

        if (!imageLocalPath) throw new ApiError(400, 'Image path is missing')
        console.log('uploading on cloudinaryyy');
        const response = await cloudinary.uploader.upload(imageLocalPath, { resource_type: 'auto' })
        console.log('uploaded on cloudianry');
        fs.unlinkSync(imageLocalPath)
        return response


    } catch (error) {
        console.log('error while uploaidng on cloudinary', error)
        fs.unlinkSync(imageLocalPath);
    }

}
export default uploadOnCloudinary