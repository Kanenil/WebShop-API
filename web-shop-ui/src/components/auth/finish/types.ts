export interface IGoogleJWT
{
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    sub: string;
    exp: number;
}

export interface IGoogleRegisterUser
{
    firstName: string;
    lastName: string;
    image: string;
    token:string;
}