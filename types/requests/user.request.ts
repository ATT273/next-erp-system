export interface CreateUserRequest {
  id: string;
  roleCode: string;
  name: string;
  email?: string;
  dob?: string;
}

export interface UserSignUp {
  name: string;
  email: string;
  password: string;
}

export interface UserSignIn {
  email: string;
  password: string;
}
