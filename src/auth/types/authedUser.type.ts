import { IUser } from 'src/user/interfaces';

export class LoggedUser implements IUser {
  id?: number;
  email?: string;
  name?: string;
  role?: string;
  gender?: string;
  password?: string;
  age?: number;
  friends?: number[];
  image?: string;
  created_at?: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.gender = user.gender;
    this.role = user.role;
    this.password = user.password;
    this.image = user.image;
    this.created_at = user.created_at;
    this.friends = user.friends;
    this.age = user.age;
  }
}
export class AuthedUser {
  user: IUser;

  access_token: string;
  refresh_token: string;

  constructor(user: IUser, accessToken: string, refreshToken: string) {
    this.user = new LoggedUser(user);
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
  }
}
