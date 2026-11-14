import { Router } from "express";
import * as aiController from "../controllers/ai.controller";

const router = Router();

router.post("/tasks/:taskId/summary", aiController.summarizeTask);
router.get("/tasks/:taskId/summaries", aiController.listSummaries);

export default router;