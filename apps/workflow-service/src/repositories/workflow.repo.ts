import { getPool } from "shared";
import { WorkFlow } from "../utils/types";



export const  createWorkFlow = async ( input:{
    taskId:string;
    eventType:string;
    message:string;
    createdBy:string
}) :Promise<WorkFlow> =>{

    const result = await getPool().query<WorkFlow>(

        `
        INSERT INTO task_workflows(task_id,event_type,message,created_by)
        VALUES($1,$2,$3,$4)
        RETURNING id, task_id, event_type, message, created_by, created_at
        `,
        [input.taskId,input.eventType,input.message,input.createdBy]
    )

    return result.rows[0];

}

export const getWorkFlowByTaskId = async (taskId:string):Promise<WorkFlow[]> =>{

    const result = await getPool ().query<WorkFlow>(
        `
        SELECT id, task_id, event_type, message, created_by, created_at
        FROM task_workflows 
        WHERE id = $1
        ORDER BY created_at DESC;
        ` ,[taskId]
    )

    return result.rows
}


export const findTaskOwner  = async (taskId :string) 
:Promise<{created_by:string | null}> =>{

    const result = await getPool().query<{created_by:string | null}>(
        `
        SELECT created_by from tasks
        WHERE id =$1

        `,[taskId]
    )
    return result.rows [0]  ?? null;
}