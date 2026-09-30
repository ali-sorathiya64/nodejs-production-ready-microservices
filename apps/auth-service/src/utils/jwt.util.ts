import jwt from "jsonwebtoken"
import { JwtPayload} from "../types/auth.types"



const extractJwtSecret =() :string=>{
    const secret = process.env.JWT_SECRET;

    if (!secret){
        throw new Error ("Jwt secert is not set")
    }

    return  secret

}

export const signToken =( 
    payload :JwtPayload

): string=>{



    const expiresIn = process.env.JWT_EXPIRES_IN as string
    


    return  jwt.sign(payload,extractJwtSecret(),{
        expiresIn:expiresIn as jwt.SignOptions["expiresIn"]
    })

   


}