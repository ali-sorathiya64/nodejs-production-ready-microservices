import { Kafka, logLevel, type KafkaConfig } from "kafkajs";
import { boolean } from "zod";

export const kafkaClient  =(
    clientId:string,
    config :Partial<KafkaConfig> ={}
)=>{

    const brokers = (process.env.KAFKA_BROKERS || "localhost:9092" )
    .split(",")
    .map((broker)=> broker.trim())
    .filter(boolean);


    if (brokers.length === 0) {
        throw new Error("Kafka broker is not set or empty")
    }


    return new Kafka({
        clientId,
        brokers,
        logLevel: logLevel.ERROR,

        retry:{
            retries:0
        },

        ...config


    });

}