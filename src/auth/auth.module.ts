import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { UserAuthenticationService } from './userauthentication.service';
import { CurrentUserinterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserAuthenticationService,
    { useClass: CurrentUserinterceptor, provide: APP_INTERCEPTOR },
  ],
})
export class AuthModule {}
