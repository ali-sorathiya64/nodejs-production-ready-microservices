import { getPool } from "shared";
import { TASK, TaskStatus } from "../types/types";


export const createTask = async (input: {
    title: string,
    created_by: string
}): Promise<TASK> => {



    const result = await getPool().query<TASK>(
        `
        INSERT INTO tasks(title,created_by)
   VALUES($1,$2)
   RETURNING id, title , status, created_by, created_at, updated_at
        `
        , [input.title, input.created_by]
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
            SELECT id, title, status, created_by, created_at, upadated_at
            FROM tasks 
            ORDER BY created_at DESC
            `
        )
        return result.rows

    }

    const result = await getPool().query<TASK>(
        ` 
        SELECT id,title,status,created_by,created_at,updated_at
        FROM tasks 
        where created_by = $1
        ORDER BY created_at DESC
        `,
        [input.userId]
    )

    return result.rows


}

export const findSingleTaskById = async (id: string): Promise<TASK | null> => {

    const result = await getPool().query(
        `
        SELECT id , title, status, created_by, created_at, updated_at
        FROM tasks
        WHERE id = $1
        `
        , [id]
    )
    return result.rows[0] ?? null;

}

export const updateTask =  async( input :{
    id :string , 
    title:string
})  :Promise <TASK>=>{

    const result = await getPool().query(
        `
        UPDATE tasks
        SET title = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, title, status, created_by, created_at, updated_at
         
        ` , [input.title , input.id]
    )
    return result.rows[0]

}


export const deleteSingleTaskById = async (id: string): Promise<boolean> => {

    const result = await getPool().query(
        `
        DELETE FROM  tasks 
        WHERE id = $1
        `, [id]
    )

    return (result.rowCount ?? 0) > 0;

}