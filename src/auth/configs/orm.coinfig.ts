import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Like } from 'src/like/entities/like.entity';
import { Message } from 'src/message/entities/message.entity';
import { Post } from 'src/post/entities/post.entity';
import { Request } from 'src/request/entities/request.entity';
import { User } from 'src/user/entities/user.entity';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'test1234',
  database: 'social-media-app',
  entities: [User, Conversation, Request, Message, Post, Like, Comment],
  synchronize: true,
};
