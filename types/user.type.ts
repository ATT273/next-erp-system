export interface IUserResponse {
  roleCode: string;
  id: string;
  name: string;
  email: string;
  active: boolean;
  dob: string;
}

export interface IFormUser {
  roleCode: string;
  name: string;
  email: string;
  dob: string;
}

export interface IResetPasswordForm {
  password: string;
}
