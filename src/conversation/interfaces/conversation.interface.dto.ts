import { User } from 'src/user/entities/user.entity';

export interface IConversation {
  id?: number;
  name?: string;
  created_at?: Date;
  participants?: User[];
  type?: string;
}
