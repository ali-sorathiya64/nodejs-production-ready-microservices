import { Request, Response, NextFunction } from "express";
import { AppError, successResponse } from "shared";
import * as aiService from "../services/ai.service";

const requireIdentity = (req: Request) => {
    const userId = req.header("x-user-id");
    const role = req.header("x-user-role");
    if (!userId || !role) throw new AppError(401, "Missing user identity");
    return { userId, role };
};

export const summarizeTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, role } = requireIdentity(req);
        const summary = await aiService.summarizeTask({
            taskId: String(req.params.taskId), userId, role,
        });
        successResponse(res, { summary }, 201);
    } catch (err) {
        next(err);
    }
};

export const listSummaries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, role } = requireIdentity(req);
        const summaries = await aiService.listSummaries({
            taskId: String(req.params.taskId), userId, role,
        });
        successResponse(res, { summaries });
    } catch (err) {
        next(err);
    }
};