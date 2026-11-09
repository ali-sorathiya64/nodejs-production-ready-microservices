import { createTaskInput } from "../schemas/task.schema";
import * as taskRepo from "../repositories/task.repo"
import { convertTaskFormat } from "../utils/task.util";
import { AppError, redis } from "shared";
import { publishTaskEvent } from "../kafka";

const TTL = 60;

const taskKey = (id: string) => `task:${id}`;
const listKey = (userId: string, role: string) =>
    role === "ADMIN" ? "tasks:admin" : `tasks:user:${userId}`;

export const createTask = async (input: createTaskInput, userId: string) => {

    const newlyCreatedTask = await taskRepo.createTask({
        title: input.title,
        created_by: userId
    })

    await redis.del(listKey(userId, "USER"), listKey(userId, "ADMIN"))

    await publishTaskEvent(newlyCreatedTask.id, userId)

    return convertTaskFormat(newlyCreatedTask)
}

export const listTasks = async (userId: string, role: string) => {

    if (!userId || !role) {
        throw new AppError(401, "Missing user identity")
    }

    const key = listKey(userId, role)

    const cached = await redis.get(key)

    if (cached) {
        await redis.incr("cache:hits")
        return JSON.parse(cached).map(convertTaskFormat)
    }

    await redis.incr("cache:misses")

    const tasks = await taskRepo.listTask({ userId, role })
    await redis.set(key, JSON.stringify(tasks), "EX", TTL)

    return tasks.map(convertTaskFormat)
}

export const getSingleTask = async (userId: string, role: string, id: string) => {

    let task
    const cached = await redis.get(taskKey(id))

    if (cached) {
        await redis.incr("cache:hits")
        task = JSON.parse(cached)
    } else {
        await redis.incr("cache:misses")

        task = await taskRepo.findSingleTaskById(id)

        if (!task) {
            throw new AppError(404, "Task not found")
        }

        await redis.set(taskKey(id), JSON.stringify(task), "EX", TTL)
    }

    if (role !== 'ADMIN' && task.created_by !== userId) {
        throw new AppError(403, "Forbidden you dont have access")
    }

    return convertTaskFormat(task)
}

export const updateTask = async (input: {
    userId: string; role: string; id: string; title: string
}) => {
    const task = await taskRepo.findSingleTaskById(input.id);

    if (!task) {
        throw new AppError(404, "Task not found")
    }

    if (input.role !== 'ADMIN' && task.created_by !== input.userId) {
        throw new AppError(403, "Forbidden you don't have access")
    }

    const update = await taskRepo.updateTask({ id: input.id, title: input.title })

    await redis.del(taskKey(input.id), listKey(task.created_by, "USER"), listKey(task.created_by, "ADMIN"))

    return convertTaskFormat(update)
}

export const taskDelete = async (role: string, id: string) => {

    if (role !== "ADMIN") {
        throw new AppError(403, "Forbidden")
    }

    const task = await taskRepo.findSingleTaskById(id);

    if (!task) {
        throw new AppError(404, "Task  does not found")
    }

    await taskRepo.deleteSingleTaskById(id);

    await redis.del(taskKey(id), listKey(task.created_by, "USER"), listKey(task.created_by, "ADMIN"))

    return { id }
}