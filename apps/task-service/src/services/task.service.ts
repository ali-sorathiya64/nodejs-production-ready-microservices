// import { Request , Response , NextFunction } from "express";

import { createTaskInput } from "../schemas/task.schema";
import * as taskRepo from "../repositories/task.repo"
import { convertTaskFormat } from "../utils/task.util";


export const createTask = async(input :createTaskInput , userId:string) =>{

    const newlyCreatedTask = await  taskRepo.createTask({
        title:input.title,
        created_by:userId
    })


    return convertTaskFormat(newlyCreatedTask)



}