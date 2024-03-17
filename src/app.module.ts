import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './auth/configs/orm.coinfig';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConversationModule } from './conversation/conversation.module';
import { WebsocketModule } from './websocket/websocket.module';
import { RequestModule } from './request/request.module';
import { MessageModule } from './message/message.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { multerOptions } from './auth/configs/multer.config';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    MulterModule.register(multerOptions),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forRoot(config),
    UserModule,
    AuthModule,
    ConversationModule,
    WebsocketModule,
    RequestModule,
    MessageModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(UserImagesMiddleware).forRoutes('/user-images');
  // }
}
