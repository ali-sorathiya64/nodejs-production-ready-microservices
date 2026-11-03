import type{ Consumer } from "kafkajs"
import { createKafkaClient } from "./client"
import { logger } from "../logger/logger";

export const createConsumer = async(clientId :string,
    groupId:string
) : Promise<Consumer> =>  {


    const kafka = createKafkaClient(clientId);

    const consumer = kafka.consumer({groupId})

    await consumer.connect();

    logger.info({clientId,groupId}, "Kafka consumer connected");


    return consumer;

}