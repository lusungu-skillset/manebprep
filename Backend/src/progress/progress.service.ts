import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { buildSyncResponse } from '../common/utils/sync-response.util';
import { Question } from '../questions/entities/question.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { GetProgressQueryDto } from './dto/get-progress-query.dto';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async create(createProgressDto: CreateProgressDto) {
    const question = await this.questionsRepository.findOne({
      where: {
        id: createProgressDto.questionId,
      },
      select: {
        id: true,
        answer: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    const progress = this.progressRepository.create({
      userId: createProgressDto.userId?.trim() || null,
      questionId: createProgressDto.questionId,
      selectedAnswer: createProgressDto.selectedAnswer,
      isCorrect:
        question.answer.trim().toLowerCase() ===
        createProgressDto.selectedAnswer.trim().toLowerCase(),
      timestamp: createProgressDto.timestamp
        ? new Date(createProgressDto.timestamp)
        : new Date(),
    });

    return this.progressRepository.save(progress);
  }

  async findAll(query: GetProgressQueryDto) {
    const where: Record<string, unknown> = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.updatedAfter) {
      where.timestamp = MoreThan(new Date(query.updatedAfter));
    }

    const progressEntries = await this.progressRepository.find({
      where,
      order: {
        timestamp: 'DESC',
      },
      select: {
        id: true,
        userId: true,
        questionId: true,
        selectedAnswer: true,
        isCorrect: true,
        timestamp: true,
      },
    });

    return buildSyncResponse(progressEntries);
  }
}
