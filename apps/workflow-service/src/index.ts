import { config } from "dotenv";
import { resolve } from "node:path";
import express from 'express'
import { AppError, errorHandler, httpLogger, logger, requireGatewaySecret, successResponse } from "shared";
import { startKafka } from "./services/workflow.service";
import worflowRoutes from "./routes/workflow.route"

config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), "../../.env") })


const app = express();

const PORT = process.env.WORKFLOW_PORT || 3004

app.use(httpLogger);
app.use(express.json())



app.use("/tasks",requireGatewaySecret,worflowRoutes)


app.get("/health",(_req,res)=>{
    successResponse(res ,{service:"worflow-service"})
})


app.use((_req,_res,next)=>{
next(new AppError(404,"Route not found"));
})

app.use(errorHandler)


async function initStartup(){
    try{

        await startKafka();
    }
    catch(err){
        logger.error({err},"Kafka consumer init failed")
    }
    
app.listen(PORT , ()=>{
    logger.info(`Workflow service is running on : ${PORT}`)
});

}

initStartup();


