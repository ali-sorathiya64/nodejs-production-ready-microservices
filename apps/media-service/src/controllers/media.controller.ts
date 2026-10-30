

import {Request,Response,NextFunction} from 'express'
import { AppError } from 'shared';



export const requireIdentity =(req:Request) =>{


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


    const attachment = await mediaService.

  



    }
    catch(err:any){
        next(err)
    }


}