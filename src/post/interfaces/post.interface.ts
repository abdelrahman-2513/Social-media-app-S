import { User } from 'src/user/entities/user.entity';

export interface IPost {
  id?: number;
  content?: string;
  user?: User;
  created_at?: Date;
  userId?: number;
}
