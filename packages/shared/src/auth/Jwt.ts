import jwt from 'jsonwebtoken'
import { JwtPayload } from './types'



const extarctJwtSecrt = ()=>{
    const secret = process.env.JWT_SECRET

    if (!secret){
        throw new Error("JWT Secret key is not set")       
    }
    return secret
}

export const signToken = ( payload :JwtPayload) :string=>{

const expiresIn = process.env.JWT_EXPIRES_IN;
    

return jwt.sign(payload,extarctJwtSecrt(),{
    expiresIn:expiresIn as jwt.SignOptions['expiresIn']
})
   

}


export const verifyToken =(token :string) : JwtPayload=>{

    const decodeToken = jwt.verify(token,extarctJwtSecrt());
    if (typeof decodeToken !== 'object' || decodeToken === null ||
         typeof decodeToken.userId !== 'string' 
         ||  ( decodeToken.role !== 'USER' && decodeToken.role !== 'ADMIN'   )

    ){


        throw new Error("Invalid token payload")
    }

    return{
        userId : decodeToken.userId,
        role :decodeToken.role
    }

}