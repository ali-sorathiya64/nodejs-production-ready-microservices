export type userRole = "USER" | "ADMIN";

export type User = {
    id :string;
    name :string;
    email :string;
    password_hash :string;
    role :userRole;
    created_at : Date;

}

export type JwtPayload ={
    userId :string,
    role :userRole
}