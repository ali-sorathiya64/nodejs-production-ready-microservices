import { config } from "dotenv";
import { resolve } from "node:path";
import express from 'express'
import { AppError, errorHandler, httpLogger, logger, successResponse } from "shared";

config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), "../../.env") })


const app = express();

const PORT = process.env.WORKFLOW_PORT || 3004

app.use(httpLogger);
app.use(express.json())



//mount routes todo


app.get("/health",(_req,res)=>{
    successResponse(res ,{service:"worflow-service"})
})


app.use((_req,_res,next)=>{
next(new AppError(404,"Route not found"));
})

app.use(errorHandler)


app.listen(PORT , ()=>{
    logger.info(`Workflow service is running on : ${PORT}`)
})