import { getPool } from "shared";
import { TASK, TaskStatus } from "../types/types";


export const createTask =  async(input:{
    text:string,
    status:TaskStatus,
    created_by:string
     created_at:Date,
     updated_at:string
}) :Promise <TASK >=>{



    const result = await getPool ().query()

}