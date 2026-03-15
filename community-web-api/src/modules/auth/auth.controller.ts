import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseLocalAuth } from './decorators/use-local-auth.decorator';
import { UseRefreshAuth } from './decorators/use-refresh-auth.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginResponseDto } from './models/login-response.dto';
import { UserData } from './models/user.data';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseLocalAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserData): Promise<LoginResponseDto> {
    return this.authService.signIn(user);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: UserData): UserData {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseRefreshAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@CurrentUser() user: UserData): Promise<LoginResponseDto> {
    return this.authService.issueNewAccessToken(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseRefreshAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: UserData): Promise<void> {
    await this.authService.logout(user);
  }
}
