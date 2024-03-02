import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/role.guards';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guards';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.AT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
