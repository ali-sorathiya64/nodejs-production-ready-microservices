import { createConsumer } from "shared"


export const startKafka = async()=>{


    const consumer = await createConsumer(
        "workflow-service",
        "workflow-service-group"
    )


    
}