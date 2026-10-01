import { UserRole } from "shared"

export type RbacRule ={
    method:string,
    path:string,
    roles:UserRole[]
}

export const publicRoute =[
    {
        method:"POST",
        path:"/auth/register"
    },
    {
        method:"POST",
        path:"/auth/login"
    }
] as const;


const rbacRules :RbacRule[]=[
    {
        method:"GET",
        path:"/auth/get-me",
        roles:["USER","ADMIN"]

    }
]