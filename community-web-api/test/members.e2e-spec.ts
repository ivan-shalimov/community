import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DataSource, Repository } from 'typeorm';

import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { Member, MemberInvite } from '../src/members/entities';
import {
  UpdateMemberNameDto,
  MemberDto,
  CreateMemberInviteDto,
  RegisterMemberDto,
} from '../src/members/dto';

describe('MembersController (e2e)', () => {
  // test data
  const testMember: MemberDto = {
    id: '',
    name: 'test',
    email: 'test@example.com',
  };

  async function addTestMember() {
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

  beforeEach(async () => {
    // todo use configuration and override for test env
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // MUST match your main.ts setup!
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    const dataSource = await app.resolve<DataSource>(DataSource);
    memberInvitesRepository =
      dataSource.getRepository<MemberInvite>(MemberInvite);
    membersRepository = dataSource.getRepository<Member>(Member);
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
          console.error('Response body:', res.body);
        }

        expect(res.status).toBe(201);
      });

    // Add a small delay to ensure transaction commits
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the invite was created in the database using the same repository
    const result = await memberInvitesRepository.findOneBy({
      email: dto.email,
    });

    expect(result).not.toBeNull();
    expect(result?.token).not.toBeNull();
    expect(result?.name).toBe(dto.name);

    // Clean up the invite after test
    if (result) {
      await memberInvitesRepository.delete(result.id);
    }
  });

  it('/api/members/invite/verify/:token?email=<email> (GET)', async () => {
    const entity = memberInvitesRepository.create({
      name: 'verify test',
      email: 'verify@example.com',
      token: 'testtoken123',
    });
    await memberInvitesRepository.save(entity);

    await request(app.getHttpServer())
      .get(`/api/members/invite/verify/${entity.token}?email=${entity.email}`)
      .expect(200);

    await memberInvitesRepository.delete(entity.id);
  });

  it('/api/members/register (POST)', async () => {
    const dto: RegisterMemberDto = {
      name: 'invited member',
      email: 'invited@example.com',
      token: 'testtoken123',
    };

    const entity = memberInvitesRepository.create({ ...dto });
    await memberInvitesRepository.save(entity);

    // Test the API response
    await request(app.getHttpServer())
      .post('/api/members/register')
      .send(dto)
      .expect((res) => {
        if (res.status !== 201) {
          console.error('Response body:', res.body);
        }

        expect(res.status).toBe(201);
      });

    // Add a small delay to ensure transaction commits
    await new Promise((resolve) => setTimeout(resolve, 100));

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

  it('/api/members/:id (PUT)', async () => {
    await addTestMember();

    const dto: UpdateMemberNameDto = { name: 'changed' };
    await request(app.getHttpServer())
      .put(`/api/members/${testMember.id}/name`)
      .send(dto)
      .expect((res) => {
        if (res.status !== 200) {
          console.error('Response body:', res.body);
        } else {
          expect(res.body).toEqual({ ...testMember, name: dto.name });
        }

        expect(res.status).toBe(200);
      });

    await deleteTestMember();
  });

  it('/api/members/:id (DELETE)', async () => {
    await addTestMember();

    await request(app.getHttpServer())
      .delete(`/api/members/${testMember.id}`)
      .expect(200);

    const result = await membersRepository.findOneBy({ id: testMember.id });
    expect(result).toBeNull();

    await deleteTestMember();
  });
});
