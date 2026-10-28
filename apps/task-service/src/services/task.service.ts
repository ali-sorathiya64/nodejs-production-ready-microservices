// import { Request , Response , NextFunction } from "express";

import { createTaskInput } from "../schemas/task.schema";
import * as taskRepo from "../repositories/task.repo"
import { convertTaskFormat } from "../utils/task.util";
import { AppError } from "shared";


export const createTask = async (input: createTaskInput, userId: string) => {

    const newlyCreatedTask = await taskRepo.createTask({
        title: input.title,
        created_by: userId
    })


    return convertTaskFormat(newlyCreatedTask)



}

export const listTasks = async (userId: string, role: string) => {

    if (!userId || !role) {
        throw new AppError(401, "Missing user identity")

    }

    const tasks = await taskRepo.listTask({userId, role})

    return tasks.map(convertTaskFormat)



}



export const getSingleTask =  async( id: string , role :string ,userId:string)=>{
    const task = await taskRepo.findSingleTaskById(id);

    if (!task){
        throw new AppError(401,"Task not found")
    }

    if (role !== 'ADMIN' || task.created_by !== userId ) {
      throw new AppError(403,"Forbidden you dont have access")
    }
return convertTaskFormat(task)



}

export const updateTask =async ( input :{
    userId: string;
    role: string;
    id: string;
    title: string;
}
) =>{
const task  :any= await taskRepo.findSingleTaskById(input.id);

 if (input.role !== 'ADMIN' || task.created_by !== input.userId ) {
      throw new AppError(403,"Forbidden you dont have access")
    }
   


    const update = await taskRepo.updateTask( {
        title:input.title,
        id :input.id
    }) 


    if (!update){
        throw new AppError(404,"Task not found")
    }

    return convertTaskFormat (update);
}


export const taskDelete =  async ( role :string ,id:string) =>{

   
    if (role !== "ADMIN"){
        throw new AppError(403,"Forbidden")
    }

     const task = await taskRepo.findSingleTaskById(id);

     if ( ! task){
        throw new AppError(404,"Task not found")
     }

     await taskRepo.deleteSingleTaskById(id);

     return {id}

    


}