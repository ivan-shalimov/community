import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { MembersService } from '../src/members/members.service';

describe('MembersController (e2e)', () => {
  let app: INestApplication<App>;
  const name = 'e2e test memeber';
  let testMemberId: string = '';

  beforeEach(async () => {
    process.env.e2e = 'true';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // init must be first to seed test user
    const membersService = await app.resolve<MembersService>(MembersService);
    const member = await membersService.findByName(name);
    if (member == undefined) {
      throw Error('Test user is not seeded');
    }
    testMemberId = member?.id;
  });

  it('/api/members (GET)', () => {
    return request(app.getHttpServer()).get('/api/members').expect(200);
  });

  it('/api/members/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/api/members/${testMemberId}`)
      .expect(200);
  });

  it('/api/members/:id (PUT)', () => {
    return request(app.getHttpServer())
      .patch(`/api/members/${testMemberId}`)
      .send({ name: 'changed' })
      .expect(200);
  });

  it('/api/members/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/api/members/${testMemberId}`)
      .expect(200);
  });
});
