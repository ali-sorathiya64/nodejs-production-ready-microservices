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

function matchPath (pattern :string ,actual :string ) :boolean  {
    if (pattern === actual){
        return true
    }

    const patternParts = pattern.split("/");
    const actualParts = actual.split("/");


    if (patternParts.length !== actualParts.length){
        return false;
    }
    return patternParts.every(
        (part,index)=> part.startsWith(":") || part === actualParts[index]

       
    )

}


export const isPublicRoute =(method :string ,path:string) :boolean=>{


    return publicRoute.some(
        (route) => route.method === method && matchPath(route.path,path)
    )

}

export const getAllowedRoles =(method:string,  path :string):UserRole[] | null=>{

    const rule = rbacRules.find(
        (currentItem) => currentItem.method === method && 
        matchPath(currentItem.path,path)
    )

    return rule?.roles  ?? null

}