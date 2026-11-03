import { createProducer, publishJsonSafe, TOPICS } from "shared";


let producer : Awaited<ReturnType<typeof createProducer>> | null = null;


export const initKafka = async()=>{

    producer = await createProducer("task-service")

}


export const publishTaskEvent =  async(taskId:string , userId:string)=>{


    await publishJsonSafe(
        producer,
        TOPICS.TASK_EVENTS,
        {
            eventType:"task.created",
            taskId,
            userId,
            message:"Task created successfully",
            timestamp: new Date().toISOString()
        },
        taskId
    )
}