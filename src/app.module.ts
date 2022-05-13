import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoriesModule } from './repositories/repositories.module';
import * as Joi from 'joi';
import config from './config';

@Module({
  imports: [
    //  Register config module for env variables validation
    ConfigModule.forRoot({
      envFilePath: ['.env-prod', '.env'],
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    RepositoriesModule,
  ],
})
export class AppModule {}
