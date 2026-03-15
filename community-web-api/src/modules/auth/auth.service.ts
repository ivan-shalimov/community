import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { CryptoHelper } from '../../common/crypto.helper';
import { ISecureConfig } from '../../config/interfaces';
import { MembersService } from '../members/services/members.service';
import { JwtPayload } from './models/jwt-payload';
import { LoginResponseDto } from './models/login-response.dto';
import { Session } from './models/session.entity';
import { UserData } from './models/user.data';
import { SessionRepository } from './repositories/session.repository';

@Injectable()
export class AuthService {
  private readonly refreshJwtSignOptions: JwtSignOptions = {
    expiresIn: '7d',
  };

  constructor(
    private membersService: MembersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionRepository: SessionRepository,
  ) {
    const secureConfig = this.configService.get<ISecureConfig>('secure');
    this.refreshJwtSignOptions = {
      ...this.refreshJwtSignOptions,
      secret: secureConfig!.jwtRefreshSecret,
    };
  }

  async signIn(member: UserData): Promise<LoginResponseDto> {
    const payload = new JwtPayload(member.id, member.email, member.name);

    const accessToken = await this.jwtService.signAsync({ ...payload });

    const session = this.sessionRepository.create({
      memberId: member.id,
      createdAt: new Date(),
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await this.sessionRepository.save(session);
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, sub: session.id },
      this.refreshJwtSignOptions,
    );
    return new LoginResponseDto(accessToken, refreshToken);
  }

  async issueNewAccessToken(user: UserData): Promise<LoginResponseDto> {
    if (!user.sessionId) {
      throw new UnauthorizedException('No session found for user');
    }
    const session = await this.sessionRepository.getById(user.sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await this.sessionRepository.remove(user.sessionId);
    return await this.signIn(user);
  }

  async logout(user: UserData): Promise<void> {
    if (!user.sessionId) {
      throw new UnauthorizedException('No session found for user');
    }

    const session = await this.sessionRepository.getById(user.sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    await this.sessionRepository.remove(user.sessionId);
  }

  async validateUser(email: string, password: string): Promise<UserData | null> {
    const member = await this.membersService.findByEmail(email);
    if (member == null) {
      console.log(`No member found with email: ${email}`);
      return null;
    }

    if (!(await CryptoHelper.verifyPassword(member.password, password))) {
      console.log(`Invalid password for email: ${email}`);
      return null;
    }

    return new UserData(member.id, member.email, member.name);
  }

  async getSessionById(id: string): Promise<Session | null> {
    return await this.sessionRepository.getById(id);
  }
}
