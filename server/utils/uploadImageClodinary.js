import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET_KEY
})

const uploadImageClodinary = async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream(
            { 
                folder : "Lanka-Basket",
                resource_type: "auto"
            },
            (error,uploadResult)=>{
                if(error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                return resolve(uploadResult);
            }
        ).end(buffer)
    })

    return uploadImage
}

export default uploadImageClodinary