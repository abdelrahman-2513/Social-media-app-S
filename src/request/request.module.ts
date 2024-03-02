import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Request])],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
