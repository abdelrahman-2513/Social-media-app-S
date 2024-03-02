export interface IUser {
  id?: number;
  name?: string;
  role?: string;
  gender?: string;
  image?: string;
  created_at?: Date;
  email?: string;
  friends?: number[];
  password?: string;
  age?: number;
}
