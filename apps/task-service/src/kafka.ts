import { createProducer } from "shared";


let producer : Awaited<ReturnType<typeof createProducer>> | null = null;


export const initKafka = async()=>{

    producer = await createProducer("task-service")

}


export  const publishTaskEvent = (taskId:string , userId:string)=>{


    await 
}