import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// it will return us a url which we will use 
export const getFromS3 = async (filename,expireIn=600) => {
     return await getSignedUrl(
        s3,
        new GetObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:filename
        }),
        {expiresIn:expireIn}
     )
}