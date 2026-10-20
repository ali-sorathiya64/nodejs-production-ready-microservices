import { Request, Response, NextFunction } from 'express'
import { AppError } from 'shared';




const IDENTITY_HEADERS = [
    "x-user-id",
    "x-user-role",
    "x-gateway-secret"
] as const





function stripIdentityHeaders(req: Request) {

    for (const header of IDENTITY_HEADERS)
{
    delete req.headers[header]
}

}


function attachGatewayRequest(req:Request){

    const gatewaySecret = process.env.GATEWAY_SECERT;

    if (!gatewaySecret){
        throw new AppError(500,"Gateway secret is not defined in .env")
    }

    req.headers['x-gateway-secret'] = gatewaySecret

}





export const gatewayAuth = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {

 // strip/remove the identity headers
    stripIdentityHeaders(req)
    attachGatewayRequest(req)

}