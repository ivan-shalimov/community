import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ICommonConfig } from '../../../config/interfaces';
import { JwtPayload } from '../models/jwt-payload';
import { UserData } from '../models/user.data';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<ICommonConfig>('common')!.jwtSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: {} & JwtPayload): UserData {
    return new UserData(payload.sub, payload.email, payload.name);
  }
}
