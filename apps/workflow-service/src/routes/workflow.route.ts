
import { Router } from "express";
import * as workFlowController from "../controllers/workflow.controller"

const router = Router();


router.get("/:taskId/workflows", workFlowController.listWorkFlows )

export default router;