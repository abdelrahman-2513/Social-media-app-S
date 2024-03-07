import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

export interface IMessage {
  id?: number;
  created_at?: Date;
  content: string;
  edited?: boolean;
  deleted?: boolean;
  user?: User;
  conversation?: Conversation;
  conversationId?: number;
}
