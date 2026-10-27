import { TASK } from "../types/types";


export const  convertTaskFormat = (task :TASK)=>{
 

    return{
    id : task.id,
    title:task.title,
    status:task.status,
    createdBy : task.created_by,
    createdAt :task.created_at,
    updatedAt : task.updated_at


    }

}