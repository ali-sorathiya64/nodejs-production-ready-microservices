import { AppError } from "shared";
import { createUser, findByEmail, findByUserId } from "../repositories/user.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import bcryptjs from 'bcryptjs'
import { convertUserFormat } from "../utils/auth.utils";
import { signToken } from "../utils/jwt.util";


export async function register(input: RegisterInput) {

    const existing = await findByEmail(input.email);

    if (existing) {
        throw new AppError(409, 'Email is already registerd');
    }


    const passwordHash = await bcryptjs.hash(input.password, 10);


    const user = await createUser({
        name: input.name,
        email: input.email,
        password_hash: passwordHash,
        role: 'USER'
    })


    return convertUserFormat(user);



}

export async function login(input: LoginInput) {

    const user = await findByEmail(input.email);

    if (!user) {
        throw new AppError(401, "Inavlid email or password");
    }

    const valid = await bcryptjs.compare(input.password, user.password_hash);

    if (!valid) {
        throw new AppError(401, "Invalid email or password")
    }

    const token = signToken({ userId: user.id, role: user.role });

    return {
        token,
        user: convertUserFormat(user)
    }

}

export const getMe =async(userId:string)=>{

    const user = await findByUserId (userId);

    if (!user){
        throw new AppError(404,"User not found")
    }
    return convertUserFormat(user);

}
