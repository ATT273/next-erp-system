export interface UserResponse {
  id: string;
  name: string;
  email: string;
  password: string;
  isOnline: boolean;
  dob: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roleCode: string;
}

export interface UserServiceResponse {
  data: UserResponse | null;
  success: boolean;
  errorMessage: string | null;
}
