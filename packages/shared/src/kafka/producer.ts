import type { Producer, RecordMetadata } from "kafkajs";
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


export const publishJson = async(
    prouducer:Producer,
    topic:string,
    payload :Record<string,unknown>,
    key ? :string

) :Promise<RecordMetadata[]>=>{

const result = await prouducer.send({
    topic,
    messages:[
        {
            key: key ?? null,
            value :JSON.stringify(payload)
        }
    ]
})
logger.info({topic,payload}, "Kafka event published")

return result;

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

        await publishJson(producer,topic,payload,key)

    }

    catch(err){
        logger.error({err,topic}, "Kafka publish failed")
    }

}