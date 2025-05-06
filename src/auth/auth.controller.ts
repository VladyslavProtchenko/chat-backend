import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  NotFoundException,
  Get,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateUserDto } from './create-user.dto';
import { setAuthCookies } from 'src/utils/auth-cookie.util';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { username: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.username);
    if (!user) throw new NotFoundException('User does not exist');

    const tokens = await this.authService.login(user);
    setAuthCookies(res, tokens);

    return user;
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const tokens = await this.authService.login(user);
    setAuthCookies(res, tokens);

    return { accessToken: tokens.accessToken };
  }

  @Post('registration')
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isUser = await this.authService.validateUser(body.username);
    if (isUser) throw new ConflictException('User already exists');

    const user = await this.authService.create(body);
    const tokens = await this.authService.login(user);

    setAuthCookies(res, tokens);

    return { user, message: 'User registered successfully' };
  }

  @UseGuards(AuthGuard('jwt-cookie'))
  @Get('user-info')
  getMe(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out' };
  }
}
