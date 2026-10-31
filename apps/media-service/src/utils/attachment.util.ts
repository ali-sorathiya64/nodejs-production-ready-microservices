import { Atachment } from "./types";



export const convertToPublicAttachmentFormat =(attachment :Atachment) =>{

 return {
    id :attachment.id,
    taskId: attachment.task_id,
    imageUrl:attachment.imageUrl,
    publicId:attachment.public_id,
    uploadedBy : attachment.uploaded_by,
    createdAt:attachment.created_at,

 }

    
}