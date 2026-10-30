import { getPool } from "shared"
import { Atachment } from "../utils/types"



export  async function findTaskAccess (taskId:string)  : Promise<{
    id:string;
    created_by:string
}| null> {

    const result = await getPool().query <{id:string , created_by:string}>(

        `
        SELECT id , created_by from tasks where id =$1
        `,
        [taskId]
    )


    return result.rows[0] ?? null;
}




export async function createAttachment(input:{
    taskId:string,
    imageUrl:string,
    publicId:string,
    uploadedBy: string

}) :Promise<Atachment> {

    const result = await getPool().query<Atachment>(
        `

        INSERT INTO attchments (task_id,imageUrl,publicId,uploadedBy)
        VALUES ($1,$2,$3,$4)
        RETURNING id , task_id, image_url,public_id,uploaded_by,created_at
        `,
        [input.taskId,input.publicId,input.imageUrl,input.uploadedBy]
    )

    return result.rows[0];

}