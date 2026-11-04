import type { Consumer, EachMessagePayload } from "kafkajs"
import { createKafkaClient } from "./client"
import { logger } from "../logger/logger";

export const createConsumer = async (clientId: string,
    groupId: string
): Promise<Consumer> => {


    const kafka = createKafkaClient(clientId);

    const consumer = kafka.consumer({ groupId })

    await consumer.connect();

    logger.info({ clientId, groupId }, "Kafka consumer connected");


    return consumer;

}

export const runConsumer = async (
    consumer: Consumer,
    topics: string[],
    handler: (payload: EachMessagePayload) => Promise<void>,
    options: { fromBeginning?: boolean }
): Promise<void> => {


    await consumer.subscribe  ({
        topics,
        fromBeginning:options.fromBeginning ??false
    })

    await consumer.run({
        eachMessage:async (payload) =>{
            const {topic,partition,message} = payload;

            logger.info({
                topic,
                partition,
                offset:message.offset,
                key:message?.key?.toString()
            })
        }
    })


}
