export interface IGoogleJWT
{
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    sub: string;
}

export interface IGoogleRegisterUser
{
    firstName: string;
    lastName: string;
    image: string;
    token:string;
}

export interface IRegisterUser 
{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}