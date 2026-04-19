import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseJwtRefreshAuthGuard } from './decorators/use-jwt-refresh-auth.decorator';
import { UseLocalAuthGuard } from './decorators/use-local-auth.decorator';
import { LoginResponseDto } from './models/login-response.dto';
import { UserData } from './models/user.data';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseLocalAuthGuard()
  @Post('login')
  async login(@CurrentUser() user: UserData): Promise<LoginResponseDto> {
    return this.authService.signIn(user);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: UserData): UserData {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseJwtRefreshAuthGuard()
  @Post('refresh')
  async refresh(@CurrentUser() user: UserData): Promise<LoginResponseDto> {
    return this.authService.issueNewAccessToken(user);
  }

  @HttpCode(HttpStatus.OK)
  @UseJwtRefreshAuthGuard()
  @Post('logout')
  async logout(@CurrentUser() user: UserData): Promise<void> {
    await this.authService.logout(user);
  }
}
