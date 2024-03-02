import { User } from 'src/user/entities/user.entity';

export interface IRequest {
  id?: number;
  fromUserId?: number;
  toUserId?: number;
  created_at?: Date;
  fromUser?: User;
  toUser?: User;
  accepted?: boolean;
}
