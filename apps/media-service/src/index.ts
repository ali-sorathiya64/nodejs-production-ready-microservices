import express from 'express'
import {config} from  'dotenv'
import { resolve } from 'node:path'
import { AppError, errorHandler, httpLogger, logger, successResponse } from 'shared';


config({path:resolve(process.cwd(),',env')});
config({path:resolve(process.cwd() ,'../../.env')});


const PORT = process.env.MEDIA_PORT || 3003;

const app = express();


app.use(httpLogger);

//  todo mount routes of media

app.get("/health" , (_req,res,) =>{
    successResponse(res,{service:'media-service'})
});


app.use((_req,_res,next) =>{
    new AppError(404 ,"Route Not found")
})

app.use(errorHandler)

app.listen(PORT , () =>{
    logger.info(`Media Service is running on ${PORT}`)
})

