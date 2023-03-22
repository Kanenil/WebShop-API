export interface IProfileEdit {
    firstName: string;
    lastName: string;
    image: File | null | string;
  }
  
  export interface IConfirmEmail {
    userId: string | null;
    token: string | null;
  }
  