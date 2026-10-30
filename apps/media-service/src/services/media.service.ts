import { AppError } from "shared";
import * as attachmentRepo from "../repositories/media.repo"




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

    // await asserTaskAccess();





}