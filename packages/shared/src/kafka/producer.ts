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