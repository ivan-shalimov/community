import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MailerService } from '@nestjs-modules/mailer';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource, Repository } from 'typeorm';

import { AppModule } from '../src/app.module';
import { CreateMemberInviteDto } from '../src/modules/members/dto/create-member-invite.dto';
import { MemberResponseDto } from '../src/modules/members/dto/member-response.dto';
import { RegisterMemberDto } from '../src/modules/members/dto/register-member.dto';
import { UpdateMemberNameDto } from '../src/modules/members/dto/update-member-name.dto';
import { MemberInvite } from '../src/modules/members/entities/member-invite.entity';
import { Member } from '../src/modules/members/entities/member.entity';

describe('MembersController (e2e)', () => {
  // test data
  const testMember: MemberResponseDto = {
    id: '',
    name: 'test',
    email: 'test@example.com',
  };

  async function addTestMember() {
    // Clean up any existing member first
    await membersRepository.delete({ email: testMember.email });

    const entity = membersRepository.create({
      name: testMember.name,
      email: testMember.email,
    });
    const result = await membersRepository.save(entity);
    testMember.id = result.id;
  }

  async function deleteTestMember() {
    await membersRepository.delete({ id: testMember.id });
  }

  let app: INestApplication<App>;
  let memberInvitesRepository: Repository<MemberInvite>;
  let membersRepository: Repository<Member>;
  const mockMailerService: Partial<MailerService> = {
    sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
  };

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
    memberInvitesRepository = dataSource.getRepository<MemberInvite>(MemberInvite);
    membersRepository = dataSource.getRepository<Member>(Member);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/api/members (GET)', async () => {
    await addTestMember();

    await request(app.getHttpServer())
      .get('/api/members')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toContainEqual(testMember);
      });

    await deleteTestMember();
  });

  it('/api/members/:id (GET)', async () => {
    await addTestMember();

    await request(app.getHttpServer())
      .get(`/api/members/${testMember.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(testMember);
      });

    await deleteTestMember();
  });

  it('/api/members/invite (POST)', async () => {
    const dto: CreateMemberInviteDto = {
      name: 'invited member',
      email: 'invited@example.com',
    };

    // Clean up any existing invite first
    await memberInvitesRepository.delete({ email: dto.email });

    // Test the API response
    await request(app.getHttpServer())
      .post('/api/members/invite')
      .send(dto)
      .expect((res) => {
        if (res.status !== 201) {
          // todo remove when logging functionality is added to the app
          console.error('Response body:', res.body);
        }

        expect(res.status).toBe(201);
      });

    // Verify the invite was created in the database using the same repository
    const result = await memberInvitesRepository.findOneBy({
      email: dto.email,
    });

    expect(result).not.toBeNull();
    expect(result?.token).not.toBeNull();
    expect(result?.name).toBe(dto.name);

    expect(mockMailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: {
          name: dto.name,
          address: dto.email,
        },
        subject: 'You are invited to join Community',
        template: 'invite',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        context: expect.objectContaining({
          name: dto.name,
          token: encodeURIComponent(result!.token),
          email: encodeURIComponent(dto.email),
        }),
      }),
    );

    // Clean up the invite after test
    if (result) {
      await memberInvitesRepository.delete(result.id);
    }
  });

  it('/api/members/invite/verify?token=<token>&email=<email> (GET)', async () => {
    await memberInvitesRepository.deleteAll();
    const entity = memberInvitesRepository.create({
      name: 'verify test',
      email: 'verify@example.com',
      token: 'testtoken123',
    });
    await memberInvitesRepository.save(entity);

    await request(app.getHttpServer())
      .get(
        `/api/members/invite/verify?token=${encodeURIComponent(entity.token)}&email=${encodeURIComponent(entity.email)}`,
      )
      .expect((res) => {
        if (res.status !== 200) {
          // todo remove when logging functionality is added to the app
          console.error('Response body:', res.body);
        }

        expect(res.status).toBe(200);
      });

    await memberInvitesRepository.deleteAll();
  });

  it('/api/members/register (POST)', async () => {
    const dto: RegisterMemberDto = {
      name: 'invited member',
      email: 'invited@example.com',
      token: 'testtoken123',
    };

    // Clean up any existing invite and member first
    await memberInvitesRepository.deleteAll();
    await membersRepository.deleteAll();
    const entity = memberInvitesRepository.create({ ...dto });
    await memberInvitesRepository.save(entity);

    // Test the API response
    await request(app.getHttpServer())
      .post('/api/members/register')
      .send(dto)
      .expect((res) => {
        if (res.status !== 201) {
          // todo remove when logging functionality is added to the app
          console.error('Response body:', res.body);
        }

        expect(res.status).toBe(201);
      });

    // Verify the member was created in the database using the same repository
    const memberResult = await membersRepository.findOneBy({
      email: dto.email,
    });

    expect(memberResult).not.toBeNull();
    expect(memberResult?.name).toBe(dto.name);
    expect(memberResult?.email).toBe(dto.email);

    const inviteResult = await memberInvitesRepository.findOneBy({
      id: entity.id,
    });
    expect(inviteResult).toBeNull();

    // Clean up the member after test
    if (memberResult) {
      await membersRepository.delete(memberResult.id);
    }
  });

  it('/api/members/:id/name (PUT)', async () => {
    await addTestMember();

    const dto: UpdateMemberNameDto = { name: 'changed' };
    await request(app.getHttpServer())
      .put(`/api/members/${testMember.id}/name`)
      .send(dto)
      .expect(200);

    // Verify the member was updated in the database using the same repository
    const memberResult = await membersRepository.findOneBy({
      id: testMember.id,
    });

    expect(memberResult).not.toBeNull();
    expect(memberResult?.name).toBe(dto.name);

    await deleteTestMember();
  });

  it('/api/members/:id (DELETE)', async () => {
    await addTestMember();

    await request(app.getHttpServer()).delete(`/api/members/${testMember.id}`).expect(200);

    const result = await membersRepository.findOneBy({ id: testMember.id });
    expect(result).toBeNull();
  });
});
