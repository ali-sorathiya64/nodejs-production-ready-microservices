import express from 'express'
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { AppError, errorHandler, httpLogger, logger, successResponse } from 'shared'

config({ path: resolve(process.cwd(), ".env") })
config({ path: resolve(process.cwd(), "../../.env") })



const PORT = process.env.TASK_PORT || 3002;

const app = express();

app.use(httpLogger)
app.use(express.json());




// mount task-routes


app.get("/health",(_req,res)=>{
    successResponse(res,{service:'task-service'})
})

app.use((_req,_res,next)=>{
    next (new AppError(404,'Route Not found'))
})


app.use(errorHandler)



app.listen(PORT, () => {
    logger.info(`Task service is running on : ${PORT}`)
})