import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Post } from 'src/post/entities/post.entity';

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
  posts?: Post[];
}
