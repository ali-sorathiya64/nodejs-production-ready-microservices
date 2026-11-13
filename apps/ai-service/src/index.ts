import express from "express";
import { errorHandler, httpLogger, logger } from "shared";



const PORT = process.env.AI_SERVICE_PORT || 3005;
const app = express();

app.use(httpLogger);
app.use(express.json())




app.use((req,res)=>{
    

})

app.use(errorHandler)

app.listen(PORT, () => {
    logger.info(`AI Service is running on port ${PORT}`);
})