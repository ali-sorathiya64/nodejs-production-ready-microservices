import type{Request,Response,NextFunction} from 'express'
import { AppError } from '../error/AppError'


// flow of this code
// read gateway secret from .env
// comapare incoming x-gateway-secret 
// match next (); neither missing/mismatch  -> 403 forbidden

export function requireGatewaySecret(req:Request , _res:Response , next :NextFunction){

const expected = process.env.GATEWAY_SECRET


if (!expected){
    return next(new AppError(500,"GATEWAY_SECRET is not defined"))
}


const incoming = req.headers["x-gateway-secret"]

if (!incoming || incoming!==expected){
   return next (new AppError(403,"Forbidden"))
}


next();



}