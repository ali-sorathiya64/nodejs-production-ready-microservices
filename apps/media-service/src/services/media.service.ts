import { AppError } from "shared";
import * as attachmentRepo from "../repositories/media.repo"
import { uploadBuffer } from "../utils/storage";
import { convertToPublicAttachmentFormat } from "../utils/attachment.util";


const asserTaskAccess =async (
    taskId: string,
    userId: string,
    role: string
) => {

    const task = await attachmentRepo.findTaskAccess(taskId);

    if (!task) {
        throw new AppError(404 ,"Task not found");
    }


    if (role !== 'ADMIN' && task.created_by !== userId) {
        throw new AppError (403,"Forbidden")

    }

}
export async function uploadAttachment(input: {
    taskId: string,
    userId: string,
    role: string,
    file?: Express.Multer.File,

}
) {

    if (!input.file) {
        throw new AppError(404, " Image file is required");
    }

     await asserTaskAccess(input.taskId, input.userId, input.role)

     const uploaded = await uploadBuffer(
        input.file.buffer,
        input.file.mimetype || 'image/jpeg'
     )


     const attachment = await attachmentRepo.createAttachment( {
        taskId:input.taskId,
        imageUrl : uploaded.imageUrl,
        publicId:uploaded.publicId,
        uploadedBy:input.userId
     }

     )
     return convertToPublicAttachmentFormat(attachment)




}