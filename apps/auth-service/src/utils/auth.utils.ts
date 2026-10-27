import { User } from "../types/auth.types";

export const convertUserFormat =   (user:User)=>{

    return {          
    id :user.id,
    name:user.name,   
    role:user.role,
    createdAt :user.created_at
    }


}