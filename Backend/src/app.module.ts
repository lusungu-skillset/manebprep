import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { ProgressModule } from './progress/progress.module';
import { QuestionsModule } from './questions/questions.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TopicsModule } from './topics/topics.module';
import { PastPapersModule } from './past-papers/past-papers.module';
import { getTypeOrmConfig } from './database/typeorm.config';

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
const databaseModules = hasDatabaseUrl
  ? [
      TypeOrmModule.forRootAsync({
        useFactory: getTypeOrmConfig,
      }),
      SubjectsModule,
      TopicsModule,
      QuestionsModule,
      ProgressModule,
      PastPapersModule,
    ]
  : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    ...databaseModules,
  ],
})
export class AppModule {}
