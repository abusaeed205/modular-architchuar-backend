export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: string;
  age: number;
  is_active?: boolean;
}
