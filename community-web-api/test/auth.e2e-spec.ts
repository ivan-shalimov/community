import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MailerService } from '@nestjs-modules/mailer';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource, Repository } from 'typeorm';

import { AppModule } from '../src/app.module';
import { CryptoHelper } from '../src/common/crypto.helper';
import { LoginResponseDto } from '../src/modules/auth/models/login-response.dto';
import { Session } from '../src/modules/auth/models/session.entity';
import { Member } from '../src/modules/members/entities/member.entity';

describe('AuthController (e2e)', () => {
  const testMember = {
    id: '',
    name: 'auth test member',
    email: 'auth.e2e@example.com',
    password: 'Password1!',
  };

  let app: INestApplication<App>;
  let membersRepository: Repository<Member>;
  let sessionsRepository: Repository<Session>;
  let accessToken: string;
  let refreshToken: string;

  const mockMailerService: Partial<MailerService> = {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
  };

  async function addTestMember() {
    await membersRepository.delete({ email: testMember.email });

    const { hash, salt } = await CryptoHelper.hashPassword(testMember.password);
    const entity = membersRepository.create({
      name: testMember.name,
      email: testMember.email,
      password: hash,
      salt,
      createdAt: new Date(),
    });

    const result = await membersRepository.save(entity);
    testMember.id = result.id;
  }

  async function login() {
    const result = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testMember.email, password: testMember.password })
      .expect(200);

    accessToken = (result.body as LoginResponseDto).accessToken;
    refreshToken = (result.body as LoginResponseDto).refreshToken;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailerService)
      .useValue(mockMailerService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const dataSource = await app.resolve<DataSource>(DataSource);
    membersRepository = dataSource.getRepository<Member>(Member);
    sessionsRepository = dataSource.getRepository<Session>(Session);

    await addTestMember();
    await login();
  });

  afterAll(async () => {
    if (testMember.id) {
      await sessionsRepository.delete({ memberId: testMember.id });
      await membersRepository.delete({ id: testMember.id });
    }

    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/api/auth/login (POST) - should return access and refresh tokens', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testMember.email, password: testMember.password })
      .expect(200)
      .expect((response) => {
        const body = response.body as LoginResponseDto;
        expect(body.accessToken).toEqual(expect.any(String));
        expect(body.refreshToken).toEqual(expect.any(String));
      });
  });

  it('/api/auth/login (POST) - should reject invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testMember.email, password: 'WrongPassword1!' })
      .expect(401);
  });

  it('/api/auth/profile (GET) - should reject unauthorized access', async () => {
    await request(app.getHttpServer()).get('/api/auth/profile').expect(401);
  });

  it('/api/auth/profile (GET) - should return current user profile', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          id: testMember.id,
          email: testMember.email,
          name: testMember.name,
        });
      });
  });

  it('/api/auth/refresh (POST) - should issue new tokens and invalidate old refresh token', async () => {
    const oldRefreshToken = refreshToken;

    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${oldRefreshToken}`)
      .expect(200)
      .expect((response) => {
        const body = response.body as LoginResponseDto;

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(body.refreshToken).not.toBe(oldRefreshToken);

        accessToken = body.accessToken;
        refreshToken = body.refreshToken;
      });

    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .set('Authorization', `Bearer ${oldRefreshToken}`)
      .expect(401);
  });

  it('/api/auth/refresh (POST) - should reject missing refresh token', async () => {
    await request(app.getHttpServer()).post('/api/auth/refresh').expect(401);
  });
});
