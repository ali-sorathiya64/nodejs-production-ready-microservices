import express from 'express'
import { validateBody } from 'shared';
import { createTaskSchema } from '../schemas/task.schema';
import * as taskController from "../controller/task.controller"


const router = express.Router ();

router.post("/create-task", validateBody(createTaskSchema), taskController.createTask );

export default router;