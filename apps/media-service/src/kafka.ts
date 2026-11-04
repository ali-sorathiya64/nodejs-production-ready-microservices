import { createProducer, publishJsonSafe, TOPICS } from "shared";


let producer :Awaited<ReturnType<typeof createProducer> | null> = null;


export const initKafka = async ()=>{

    producer = await createProducer("media-service");

}

export const publishAttachmentEvent =  async(
taskId:string,
userId:string

) =>{
    await publishJsonSafe(
        producer,
        TOPICS.MEDIA_EVENTS,
        {
            eventType :"attachment.uploaded",
            taskId,
            userId,
            message:"Attachment uploaded",
            timestamp: new Date().toISOString()
        }

    )

}