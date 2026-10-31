import { PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import {randomUUID} from 'node:crypto'

function getClient () {
    const endpoint = process.env.AWS_ENDPOINT_URL_S3;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION || "auto";
    
    if (!endpoint || !accessKeyId || !secretAccessKey )
      throw new Error ("Storage  env's are not set");


    return new S3Client({
        region,
        endpoint,
        credentials:{accessKeyId:accessKeyId,secretAccessKey},
        forcePathStyle:true
    
})

}

export const uploadBuffer = async (
    buffer: Buffer,
    contentType: string | "image/jpeg"
): Promise<{ imageUrl: string, publicId: string }> => {
    

    const bucket = process.env.STORAGE_BUCKET;
    const endpoint =process.env.AWS_ENDPOINT_URL_S3;


    if(!bucket || !endpoint){
        throw new Error("endpoint and bucket are not set")
    }

    const Key = `support-tasks/${randomUUID()}`;


    await getClient().send(
        new PutObjectCommand({
            Bucket:bucket,
            Key,
            Body:buffer,
            ContentType:contentType

        })
    )


    const baseUrl = endpoint.endsWith("/") ? endpoint.slice(0,-1) :endpoint;

    return{

        publicId: Key, 
        imageUrl : `${baseUrl}/${bucket}/${Key}`
    }

}




