import express,{Request,Response} from 'express';
import { config } from 'dotenv'
import { resolve } from 'node:path';
import { AppError, errorHandler, httpLogger, logger, successResponse } from 'shared';
import authRoutes from "./routes/auth.route"


config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });


const PORT = process.env.AUTH_PORT || 3001


const app  = express();

app.use(httpLogger);
app.use(express.json());
app.use("/auth",authRoutes)


app.get("/health",(_req:Request,res:Response)=>{
    successResponse(res, {service:"auth-service"})

})

app.use((_req ,_res ,next)=>{
    next(new AppError(404,"Route Not Found"))
})

app.use(errorHandler);


app.listen(PORT , ()=>{
  logger.info(`Auth Service is running on port ${PORT}`)
})
