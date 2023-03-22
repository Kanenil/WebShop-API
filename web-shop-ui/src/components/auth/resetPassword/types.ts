export interface IResetPassword {
  userId: string | null;
  token: string | null;
  password: string;
  confirmPassword: string;
}
