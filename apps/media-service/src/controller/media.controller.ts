

import {Request,Response,NextFunction} from 'express'
import { AppError, successResponse } from 'shared';
import * as attachmentService from '../services/media.service'



 const requireIdentity =(req:Request) =>{


    const userId = req.header("x-user-id");
    const role = req.header("x-user-role");

    if (!userId || ! role) {
        throw new AppError(401, 'Missing user Identity')
    }
    return {userId, role}
}







export const uploadAttachment =  async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
try{

    const {userId , role} = requireIdentity(req);

    const taskId = String(req.params.taskId)


    const attachment = await attachmentService.uploadAttachment(
        {
        taskId,
        userId,
        role,
        file:req.file
    
        }
    )

    successResponse(res,{attachment},201)


    }
    catch(err:any){
        next(err)
    }


}