import type { Request, Response, NextFunction } from 'express'
import { Router } from 'express'
import * as attachmentController from '../controllers/media.controller'
import { uploadImage } from '../middleware/upload.middleware';
import { AppError } from 'shared';

const router = Router();


function handleUpload(req: Request, res: Response, next: NextFunction) {
    uploadImage(req, res, (err: unknown) => {
        if (!err) {
            return next()
        }

        if (err instanceof AppError) {
            return next(err)
        }

        if (typeof err === "object" &&
            err !== null &&
            "code" in err && err.code === "LIMIT_FILE_SIZE") {

            return next(new AppError(400, "Image must be 1mb or smaller"))
        }
        return next (new AppError(400,"Invalid image upload"))
    })

}



//this is the url of the corresponding route --> http://localhost:300/tasks/:id/attachment

router.post("/:taskId/attachments")