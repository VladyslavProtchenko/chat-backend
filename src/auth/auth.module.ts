import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtCookieStrategy } from './jwt-cookie.strategy';
import { Module } from '@nestjs/common';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtCookieStrategy, JwtRefreshStrategy],
  exports: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({ secret: 'secret' }),
  ],
})
export class AuthModule {}
