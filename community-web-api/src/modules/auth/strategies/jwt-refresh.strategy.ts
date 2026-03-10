import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ISecureConfig } from '../../../config/interfaces';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../models/jwt-payload';
import { UserData } from '../models/user.data';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<ISecureConfig>('secure')!.jwtRefreshSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: {} & JwtPayload): Promise<UserData> {
    const session = await this.authService.getSessionById(payload.sub);
    // if session is not found or expired, throw an error
    if (!session || session.expiredAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // if session is valid, accespt the user data from the payload,
    // but use the memberId from the session because the payload sub is the session id, not the member id
    return new UserData(session.memberId, payload.email, payload.name, session.id);
  }
}
