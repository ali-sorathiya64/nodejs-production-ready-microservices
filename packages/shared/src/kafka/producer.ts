import type { Producer } from "kafkajs";
import { createKafkaClient } from "./client";
import { logger } from "../logger/logger";



export const createProducer = async (clientId: string): Promise<Producer> => {

    const kafka = createKafkaClient(clientId);



    // responsible for sending records/data tp the kafka topics
    const producer = kafka.producer();


    await producer.connect()



    logger.info({ clientId }, "Kafka producer connected");

    return producer;


}



export const publishJsonSafe = async(producer:Producer | null,
    topic:string,
    payload : Record<string,unknown>,
    key ?:string
) :Promise <void>=>{

    if  (!producer){

        logger.warn({topic} , "Kafka producer is not empty")
        return
    }


    try{

    }

    catch(err){
        logger.error({err,topic}, "Kafka publish failed")
    }

}