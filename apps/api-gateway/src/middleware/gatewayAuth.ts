import { Request, Response, NextFunction } from 'express'
import { AppError, verifyToken } from 'shared';
import { getAllowedRoles, isPublicRoute, publicRoute } from '../rbac';


const IDENTITY_HEADERS = [
    "x-user-id",
    "x-user-role",
    "x-gateway-secret"
] as const



// trust any headers receive from client --> BIG NO
// suppose BSC --> :3000/auth/me -H authorization Bearer <user-token>
//-H --> x-user-if --> demo-user-id



function stripIdentityHeaders(req: Request) {

    for (const header of IDENTITY_HEADERS)
{
    delete req.headers[header]
}

}




// proves to auth service --> this req come through the gateway

function attachGatewayRequest(req:Request){

    const gatewaySecret = process.env.GATEWAY_SECERT;

    if (!gatewaySecret){
        throw new AppError(500,"Gateway secret is not defined in .env")
    }



    req.headers["x-gateway-secret"] = gatewaySecret

}


function requestPath(req:Request){

    const combined = `${req.baseUrl} ${req.path} `

    if (combined.length>1 && combined.endsWith("/")){
        return combined.slice(0,1)
    }

    return combined || "/"

}

function attachUserHeaders (req :Request,  userId:string, role  :string  ){

    req.headers["x-user-id"]= userId;
    req.headers["x-user-role"]= role;

}


export const gatewayAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {


    try{
 // strip/remove the identity headers
    stripIdentityHeaders(req)
    attachGatewayRequest(req)



    const path = requestPath(req)

 // if this path is a public route we are going to bypass 
 // we dont need path
if(isPublicRoute(req.method ,path)){

    return next()
}

const authHeader = req.headers['authorization'];

if (!authHeader ?.startsWith("Bearer ")){
    throw new AppError(401, "Invalid bearer token")
}

const token = authHeader.slice ("Bearer".length).trim();

const payload = verifyToken(token)


const allowedRoles = getAllowedRoles(req.method,path)

if (!allowedRoles){
    throw new AppError(404,'Route not found')
}


if (!allowedRoles.includes(payload.role)){
    throw new AppError(403,'Forbidden, you dont have a access to this route')
}


attachUserHeaders(req,payload.userId,payload.role);
next();

}

catch(error){
    if (error instanceof AppError) {
        return next(error)
    }
}


// in some reason jwt.verify fails so --> generic 401 error
return next (new AppError(401,"Invalid or expired token"))

}