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
