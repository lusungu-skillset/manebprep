import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { isUniqueConstraintViolation } from '../common/utils/database-error.util';
import { buildSyncResponse } from '../common/utils/sync-response.util';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { GetSubjectsQueryDto } from './dto/get-subjects-query.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      const subject = this.subjectsRepository.create({
        name: createSubjectDto.name.trim(),
        form: createSubjectDto.form,
      });

      return await this.subjectsRepository.save(subject);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(
          'A subject with this name already exists for the selected form.',
        );
      }

      throw error;
    }
  }

  async findAll(query: GetSubjectsQueryDto) {
    const where: Record<string, unknown> = {};

    if (query.form) {
      where.form = query.form;
    }

    if (query.updatedAfter) {
      where.updatedAt = MoreThan(new Date(query.updatedAfter));
    }

    const subjects = await this.subjectsRepository.find({
      where,
      order: {
        form: 'ASC',
        name: 'ASC',
      },
      select: {
        id: true,
        name: true,
        form: true,
        updatedAt: true,
      },
    });

    return buildSyncResponse(subjects);
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.findOneOrThrow(id);

    subject.name = updateSubjectDto.name?.trim() ?? subject.name;
    subject.form = updateSubjectDto.form ?? subject.form;

    try {
      return await this.subjectsRepository.save(subject);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(
          'A subject with this name already exists for the selected form.',
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    const subject = await this.findOneOrThrow(id);

    await this.subjectsRepository.remove(subject);

    return {
      id,
      deleted: true,
    };
  }

  private async findOneOrThrow(id: number) {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found.');
    }

    return subject;
  }
}
