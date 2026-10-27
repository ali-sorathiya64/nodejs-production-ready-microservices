import { Request, Response, NextFunction } from "express"
import { AppError } from "./AppError"
import { logger } from "../logger/logger"

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    logger.error({ err }, "Unhandled error")

    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    })
}