import express,{Request,Response} from 'express'
import { config } from "dotenv";
import {resolve} from 'node:path'
import { httpLogger, logger, successResponse } from "shared";
import helmet from 'helmet'
import cors from 'cors'
import rateLimit, { MINUTE } from 'express-rate-limit';




config({path:resolve(process.cwd(),'.env' )});
config({path:resolve(process.cwd(),  '../../.env' )});

const app = express();


const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001"


// secure default http headers
app.use(helmet());
app.use(cors());
app.use(rateLimit({
    windowMs:15 *MINUTE ,
    limit:100,
    standardHeaders:true,
    'legacyHeaders':false,
}));

app.use(httpLogger);
app.use (express.json());

app.get("/health",(_req,res) =>{
    successResponse(res,{
        service:'api-gateway'
    })

});







app.listen(PORT , ()=>{
    logger.info(`API Gateway is running on ${PORT}`)
})
