// MUST be imported first - sets IPv4 preference globally
import './common/utils/ipv4-dns';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

function getCorsOriginConfig(): true | string[] {
  const frontendUrl = process.env.FRONTEND_URL
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (frontendUrl && frontendUrl.length > 0) {
    return frontendUrl;
  }

  // Default to permissive CORS in local/dev setups so the Next.js frontend
  // can reach the API even when FRONTEND_URL has not been configured yet.
  return true;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: getCorsOriginConfig(),
    credentials: true,
  });
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = Number(process.env.PORT ?? 5000);

  await app.listen(port);

  console.log(`MANEB Prep API is running on port ${port}.`);

  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set. Only non-database routes are available.');
  }
}

void bootstrap();
