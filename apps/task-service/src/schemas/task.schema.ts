

import {z} from 'zod'


export const createTaskSchema = z.object({
    title : z.string().min(5,"Title is required")
})


export type createTaskInput = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters")
})