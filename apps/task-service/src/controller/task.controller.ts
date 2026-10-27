 

import type{ Request , Response , NextFunction } from "express";
import { AppError, successResponse } from "shared";
import   * as taskService from "../services/task.service";


function requireIdentity (req:Request){

    const userId = req.header ("x-user-id");
    const role = req.header ("x-user-role");

    if  (!userId || ! role){
        throw new AppError (401,"Missing user identity")
    }
    return {userId, role}
}




 export async function  createTask (req:Request , res:Response, next:NextFunction){


    try{ 

        const {userId} = requireIdentity (req)

        const task = await taskService.createTask (req.body, userId)

        successResponse (res,{task},201)

    }

    catch(error:any){
        next ( error)
    }

 }

 export const listTasks  = async(req:Request , res:Response, next:NextFunction) =>{


    try{

        const {userId , role} = requireIdentity(req);

        const list = await taskService.listTasks(userId,role)

        successResponse(res,{list})


    }
    catch(err:any){
        next(err)
    }
 }