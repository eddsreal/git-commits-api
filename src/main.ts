import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http.exception.filter';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Filters
  app.useGlobalFilters(new AllExceptionFilter());

  //  Interceptors
  app.useGlobalInterceptors(new TimeoutInterceptor());

  //  Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
