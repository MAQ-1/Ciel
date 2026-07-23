import s3 from "../config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";



// jo save krni hai uska naam , kya store krna hai , aur content type kya hai ye pass krna hoga
export const uploadToS3 = async (filename, buffer, contentType) => {
    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: contentType
        })
    )

    return filename
}