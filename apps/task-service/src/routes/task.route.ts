import express from 'express'
import { validateBody } from 'shared';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import * as taskController from "../controller/task.controller"


const router = express.Router ();

router.post("/create-task", validateBody(createTaskSchema), taskController.createTask );
router.get("/list-task",  taskController.listTasks );
router.get("/task/:id",taskController.getSingleTask);
router.put("/:id", validateBody(updateTaskSchema), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
export default router;