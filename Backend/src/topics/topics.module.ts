import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminKeyGuard } from '../common/guards/admin-key.guard';
import { Subject } from '../subjects/entities/subject.entity';
import { Topic } from './entities/topic.entity';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Subject])],
  controllers: [TopicsController],
  providers: [TopicsService, AdminKeyGuard],
  exports: [TypeOrmModule, TopicsService],
})
export class TopicsModule {}
