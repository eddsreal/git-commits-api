import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { RepositoriesService } from '../repositories/repositories.service';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { HttpModule, HttpService } from '@nestjs/axios';

describe('endToEnd', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const testAppModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: [RepositoriesService],
    }).compile();

    app = testAppModule.createNestApplication();
    httpService = testAppModule.get<HttpService>(HttpService);
    await app.init();
  });

  it('Get Repositories', async () => {
    const result: AxiosResponse = {
      data: [
        {
          name: 'git-commits-api',
          url: 'https://api.github.com/repos/eddsreal/git-commits-api',
          language: 'Typescript',
          clone_url: 'https://github.com/eddsreal/git-commits-api.git',
        },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(result as unknown as any));

    const response = await request(app.getHttpServer())
      .get('/repositories/test')
      .expect(200);
    expect(response.body).toEqual(result.data);
  });

  it('Fail when missing profile Repositories', async () => {
    const result: AxiosResponse = {
      data: {
        path: '/repositories',
        error: {
          statusCode: 404,
          message: 'Cannot GET /repositories',
          error: 'Not Found',
        },
      },
      status: 404,
      statusText: '',
      headers: {},
      config: {},
    };

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(result as unknown as any));

    const response = await request(app.getHttpServer())
      .get('/repositories')
      .expect(404);
    expect(response.status).toEqual(404);
  });

  it('Fail when repository not found', async () => {
    const result: AxiosResponse = {
      data: {},
      status: 404,
      statusText: '',
      headers: {},
      config: {},
    };
    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(result as unknown as any));

    const response = await request(app.getHttpServer())
      .get('/repositories/notfoundssssss')
      .expect(404);
    expect(response.status).toEqual(404);
  });
});
