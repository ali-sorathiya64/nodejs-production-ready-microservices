import { getPool } from "shared";
import { TASK, TaskStatus } from "../types/types";


export const createTask = async (input: {
    text: string,
    status: TaskStatus,
    created_by: string
    created_at: Date,
    updated_at: string
}): Promise<TASK> => {



    const result = await getPool().query<TASK>(
        `
        INSERT INTO tasks(text,created_by)
   VALUES($1,$2)
   RETURNING id, text , status, created_by, created_at, updated_at
        `
        , [input.text, input.created_by]
    )
    return result.rows[0]

}



export const listTask = async (input: {
    userId: string,
    role: string
}): Promise<TASK[]> => {


    if (input.role == 'ADMIN') {

        const result = await getPool().query<TASK>(
            `
            SELECT id, text, status, created_by, created_at, upadated_at
            FROM tasks 
            ORDER BY created_at DESC
            `
        )
        return result.rows

    }

    const result = await getPool().query<TASK>(
        ` 
        SELECT id,text,status,created_by,created_at,updated_at
        FROM tasks 
        where created_by = $1
        ORDER BY created_at DESC
        `,
        [input.userId]
    )

    return result.rows


}

export const findSingleTaskById = async( id :string)  : Promise<TASK | null>=>{

    const result = await  getPool().query(
        `
        SELECT id , text, status, created_by, created_at, updated_at
        FROM tasks
        WHERE id = $1
        `
        ,[id]
    )
    return result.rows[0] ?? null;

}


export const deleteSingleTaskById  = async (id:string):Promise<boolean>=>{

    const result = await getPool ().query(
        `
        DELETE FROM  tasks 
        WHERE id = $1
        `,[id]
    )

    return  ( result.rowCount  ?? 0) >0;

}