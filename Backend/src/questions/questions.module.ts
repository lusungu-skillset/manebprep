import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminKeyGuard } from '../common/guards/admin-key.guard';
import { Subject } from '../subjects/entities/subject.entity';
import { Topic } from '../topics/entities/topic.entity';
import { Question } from './entities/question.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Subject, Topic])],
  controllers: [QuestionsController],
  providers: [QuestionsService, AdminKeyGuard],
  exports: [TypeOrmModule, QuestionsService],
})
export class QuestionsModule {}
