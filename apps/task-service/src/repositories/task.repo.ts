import { getPool } from "shared";
import { TASK, TaskStatus } from "../types/types";


export const createTask =  async(input:{
    text:string,
    status:TaskStatus,
    created_by:string
     created_at:Date,
     updated_at:string
}) :Promise <TASK >=>{



    const result = await getPool ().query(
        `
        INSERT INTO tasks(text,created_by)
   VALUES($1,$2)
   RETURNING id, text , status, created_by, created_at, updated_at
        ` 
        ,[input.text , input.created_by]
    )
    return result.rows[0]

}