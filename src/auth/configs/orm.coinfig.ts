import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { Request } from 'src/request/entities/request.entity';
import { User } from 'src/user/entities/user.entity';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'test1234',
  database: 'social-media-app',
  entities: [User, Conversation, Request, Message],
  synchronize: true,
};
