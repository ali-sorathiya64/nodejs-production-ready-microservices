 

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

 export const getSingleTask = async(
    req:Request , res:Response, next:NextFunction
 ) =>{

    try{

        const {userId , role} = requireIdentity(req)

        const id = String(req.params.id)

        const task= await taskService.getSingleTask(userId , role , id  )

        successResponse(res ,{task})

    }
    catch(err:any){
        next(err)
    }

 }

 export const updateTask = async(req:Request , res:Response, next:NextFunction) =>{


    try{

        const {userId , role}  = requireIdentity(req);
        const id = String(req.params.id)
        const {title} = req.body

        const task = taskService.updateTask({
            userId,
            role,
            id,
            title
        }) 
         successResponse(res, { task })
    

    }
    catch(err:any){
        next(err)
    }


 }

 export const deleteTask = async(
     req:Request , res:Response, next:NextFunction
 ) =>{

    try{

        const  { role} = requireIdentity(req);
        const id = String (req.params.id)


        const deleteResult =  taskService.taskDelete(role, id)

        successResponse(res,deleteResult)

    }
    catch(err){
        next (err)

    }
 }