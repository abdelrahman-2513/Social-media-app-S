import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

export interface IComment {
  id?: number;
  user?: Promise<User>;
  post?: Post;
  content?: string;
  created_at?: Date;
}
