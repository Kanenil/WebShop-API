export interface IAuthUser {
    image: string,
    roles:string,
    name: string,
    email: string,
    isAuth: boolean,
    emailConfirmed: boolean
};

export enum AuthActionType {
    USER_LOGIN="USER_LOGIN_ACTION",
    USER_LOGOUT="USER_LOGOUT_ACTION",
    SET_USER="USER_SET_ACTION"
}