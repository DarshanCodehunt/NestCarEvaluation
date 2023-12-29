import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handle signup request', () => {
    const email = 'd@t.co';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'abc' })
      .expect(201)
      .then((response) => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('should signup the user and return thr current user', async () => {
    const email = 'd@t1.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'abc' })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });
});
