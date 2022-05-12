import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
        GIT_PROFILE: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
