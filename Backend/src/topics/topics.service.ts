import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { isUniqueConstraintViolation } from '../common/utils/database-error.util';
import { buildSyncResponse } from '../common/utils/sync-response.util';
import { Subject } from '../subjects/entities/subject.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { GetTopicsQueryDto } from './dto/get-topics-query.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async create(createTopicDto: CreateTopicDto) {
    await this.ensureSubjectExists(createTopicDto.subjectId);

    try {
      const topic = this.topicsRepository.create({
        name: createTopicDto.name.trim(),
        subjectId: createTopicDto.subjectId,
      });

      const savedTopic = await this.topicsRepository.save(topic);
      return this.findTopicDetailsOrThrow(savedTopic.id);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(
          'A topic with this name already exists for the selected subject.',
        );
      }

      throw error;
    }
  }

  async findAll(query: GetTopicsQueryDto) {
    const where: Record<string, unknown> = {};

    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }

    if (query.updatedAfter) {
      where.updatedAt = MoreThan(new Date(query.updatedAfter));
    }

    const topics = await this.topicsRepository.find({
      where,
      relations: {
        subject: true,
      },
      order: {
        name: 'ASC',
      },
      select: {
        id: true,
        name: true,
        subjectId: true,
        updatedAt: true,
        subject: {
          id: true,
          name: true,
          form: true,
        },
      },
    });

    return buildSyncResponse(topics);
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    const topic = await this.findOneOrThrow(id);
    const nextSubjectId = updateTopicDto.subjectId ?? topic.subjectId;

    await this.ensureSubjectExists(nextSubjectId);

    topic.name = updateTopicDto.name?.trim() ?? topic.name;
    topic.subjectId = nextSubjectId;

    try {
      await this.topicsRepository.save(topic);
      return this.findTopicDetailsOrThrow(topic.id);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(
          'A topic with this name already exists for the selected subject.',
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    const topic = await this.findOneOrThrow(id);

    await this.topicsRepository.remove(topic);

    return {
      id,
      deleted: true,
    };
  }

  private async findOneOrThrow(id: number) {
    const topic = await this.topicsRepository.findOne({
      where: { id },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found.');
    }

    return topic;
  }

  private async findTopicDetailsOrThrow(id: number) {
    const topic = await this.topicsRepository.findOne({
      where: { id },
      relations: {
        subject: true,
      },
      select: {
        id: true,
        name: true,
        subjectId: true,
        updatedAt: true,
        subject: {
          id: true,
          name: true,
          form: true,
        },
      },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found.');
    }

    return topic;
  }

  private async ensureSubjectExists(subjectId: number) {
    const subject = await this.subjectsRepository.findOne({
      where: { id: subjectId },
      select: {
        id: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }
  }
}
