import { getPool } from "shared";
import { userRole } from "../types/auth.types";
import { User } from "../types/auth.types";


export const findByEmail = async(email :string):Promise<User | null>=>{


    const result = await getPool().query(
        `
        SELECT id, name, email,password_hash, role, created_at
        from users where email = $1
        
        `,
        [email]
    )
    return result.rows[0] ?? null;
}


export const createUser = async(input:{
    name:string,
    email:string,
    password_hash:string,
    role:userRole
}) : Promise<User>=>
{


    const result = await getPool().query(
        `INSERT INTO users(name,email,password_hash,role)
        VALUES ($1,$2,$3,$4)
        RETURNING id, name, email, password_hash, role, created_at
        `
        , [input.name,input.email,input.password_hash,input.role ?? "USER"]
    )

    return result.rows[0]
}



export const findByUserId =async(userId:string): Promise<User | null>=>{

    const result = await getPool().query<User>(
        `
        SELECT name,email,password_hash,role from users where id =1;
        `
        ,[userId]
    )
    return result.rows[0] ?? null;


}