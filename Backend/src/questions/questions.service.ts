import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  isForeignKeyViolation,
  isUniqueConstraintViolation,
} from '../common/utils/database-error.util';
import { buildSyncResponse } from '../common/utils/sync-response.util';
import { Subject } from '../subjects/entities/subject.entity';
import { Topic } from '../topics/entities/topic.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { DownloadQuestionsQueryDto } from './dto/download-questions-query.dto';
import { GetQuestionsQueryDto } from './dto/get-questions-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { QuestionDifficulty } from './enums/question-difficulty.enum';

type QuestionResponseItem = {
  id: number;
  topicId: number;
  subjectId: number;
  topic: string;
  subject: string;
  form: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  year: number | null;
  difficulty: string;
  updatedAt: Date;
};

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(Topic)
    private readonly topicsRepository: Repository<Topic>,
  ) {}

  async bulkCreate(createQuestionDtos: CreateQuestionDto[]) {
    if (createQuestionDtos.length === 0) {
      throw new BadRequestException('At least one question is required.');
    }

    await this.ensureTopicsExist(
      Array.from(new Set(createQuestionDtos.map((item) => item.topicId))),
    );

    try {
      const savedQuestions = await this.questionsRepository.manager.transaction(
        async (manager) => {
          const repository = manager.getRepository(Question);
          const entities = createQuestionDtos.map((item) =>
            repository.create(this.normalizeQuestionValues(item)),
          );

          return repository.save(entities);
        },
      );

      const createdQuestions = await this.findQuestionsByIds(
        savedQuestions.map((question) => question.id),
      );

      return buildSyncResponse(this.mapQuestions(createdQuestions));
    } catch (error) {
      this.handleQuestionWriteError(error);
    }
  }

  async create(createQuestionDto: CreateQuestionDto) {
    await this.ensureTopicsExist([createQuestionDto.topicId]);

    try {
      const question = this.questionsRepository.create(
        this.normalizeQuestionValues(createQuestionDto),
      );

      const savedQuestion = await this.questionsRepository.save(question);

      return this.findMappedQuestionById(savedQuestion.id);
    } catch (error) {
      this.handleQuestionWriteError(error);
    }
  }

  async findAll(query: GetQuestionsQueryDto) {
    const queryBuilder = this.questionsRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.topic', 'topic')
      .leftJoinAndSelect('topic.subject', 'subject');

    if (query.topicId) {
      queryBuilder.andWhere('question.topicId = :topicId', {
        topicId: query.topicId,
      });
    }

    if (query.subjectId) {
      queryBuilder.andWhere('subject.id = :subjectId', {
        subjectId: query.subjectId,
      });
    }

    if (query.subject) {
      queryBuilder.andWhere('LOWER(subject.name) LIKE LOWER(:subject)', {
        subject: `%${query.subject}%`,
      });
    }

    if (query.search) {
      queryBuilder.andWhere(
        `(
          LOWER(question.question) LIKE LOWER(:search)
          OR LOWER(question.explanation) LIKE LOWER(:search)
          OR LOWER(topic.name) LIKE LOWER(:search)
        )`,
        {
          search: `%${query.search}%`,
        },
      );
    }

    if (query.form) {
      queryBuilder.andWhere('subject.form = :form', { form: query.form });
    }

    if (query.updatedAfter) {
      queryBuilder.andWhere('question.updatedAt > :updatedAfter', {
        updatedAfter: query.updatedAfter,
      });
    }

    const questions = await queryBuilder
      .orderBy('topic.name', 'ASC')
      .addOrderBy('question.id', 'ASC')
      .getMany();

    return buildSyncResponse(this.mapQuestions(questions));
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.findQuestionOrThrow(id);
    const nextTopicId = updateQuestionDto.topicId ?? question.topicId;

    await this.ensureTopicsExist([nextTopicId]);

    try {
      const normalizedValues = this.normalizeQuestionValues({
        topicId: nextTopicId,
        question: updateQuestionDto.question ?? question.question,
        options: updateQuestionDto.options ?? question.options,
        answer: updateQuestionDto.answer ?? question.answer,
        explanation: updateQuestionDto.explanation ?? question.explanation,
        difficulty: updateQuestionDto.difficulty ?? question.difficulty,
        year:
          updateQuestionDto.year === undefined ? (question.year ?? null) : updateQuestionDto.year,
      });

      Object.assign(question, normalizedValues);

      await this.questionsRepository.save(question);

      return this.findMappedQuestionById(id);
    } catch (error) {
      this.handleQuestionWriteError(error);
    }
  }

  async remove(id: number) {
    const question = await this.findQuestionOrThrow(id);

    await this.questionsRepository.remove(question);

    return {
      id,
      deleted: true,
    };
  }

  async downloadBySubject(query: DownloadQuestionsQueryDto) {
    const subject = await this.subjectsRepository
      .createQueryBuilder('subject')
      .where('LOWER(subject.name) LIKE LOWER(:subject)', {
        subject: `%${query.subject}%`,
      })
      .andWhere('subject.form = :form', { form: query.form })
      .orderBy('subject.name', 'ASC')
      .getOne();

    if (!subject) {
      throw new NotFoundException('Subject not found for the requested form.');
    }

    const queryBuilder = this.questionsRepository
      .createQueryBuilder('question')
      .innerJoinAndSelect('question.topic', 'topic')
      .where('topic.subjectId = :subjectId', { subjectId: subject.id });

    if (query.updatedAfter) {
      queryBuilder.andWhere('question.updatedAt > :updatedAfter', {
        updatedAfter: query.updatedAfter,
      });
    }

    const questions = await queryBuilder
      .orderBy('topic.name', 'ASC')
      .addOrderBy('question.id', 'ASC')
      .getMany();

    const mappedQuestions = this.mapQuestions(
      questions.map((question) => ({
        ...question,
        topic: {
          ...question.topic,
          subject,
        },
      })),
    );

    const groupedTopics = new Map<
      number,
      {
        id: number;
        name: string;
        questionCount: number;
        questions: QuestionResponseItem[];
      }
    >();

    for (const item of mappedQuestions) {
      const existing = groupedTopics.get(item.topicId);

      if (existing) {
        existing.questions.push(item);
        existing.questionCount = existing.questions.length;
        continue;
      }

      groupedTopics.set(item.topicId, {
        id: item.topicId,
        name: item.topic,
        questionCount: 1,
        questions: [item],
      });
    }

    const syncMeta = buildSyncResponse(mappedQuestions);

    return {
      subject: {
        id: subject.id,
        name: subject.name,
        form: subject.form,
        updatedAt: subject.updatedAt,
      },
      topics: Array.from(groupedTopics.values()),
      count: syncMeta.count,
      syncedAt: syncMeta.syncedAt,
      lastUpdatedAt:
        syncMeta.lastUpdatedAt ?? subject.updatedAt.toISOString(),
    };
  }

  private mapQuestions(questions: Question[]): QuestionResponseItem[] {
    return questions.map((question) => ({
      id: question.id,
      topicId: question.topicId,
      subjectId: question.topic.subject.id,
      topic: question.topic.name,
      subject: question.topic.subject.name,
      form: question.topic.subject.form,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
      year: question.year ?? null,
      difficulty: question.difficulty,
      updatedAt: question.updatedAt,
    }));
  }

  private async findQuestionOrThrow(id: number) {
    const question = await this.questionsRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Question not found.');
    }

    return question;
  }

  private async findMappedQuestionById(id: number) {
    const questions = await this.findQuestionsByIds([id]);

    if (questions.length === 0) {
      throw new NotFoundException('Question not found.');
    }

    return this.mapQuestions(questions)[0];
  }

  private async findQuestionsByIds(ids: number[]) {
    return this.questionsRepository.find({
      where: {
        id: In(ids),
      },
      relations: {
        topic: {
          subject: true,
        },
      },
      order: {
        id: 'ASC',
      },
    });
  }

  private normalizeQuestionValues(createQuestionDto: CreateQuestionDto) {
    const options = createQuestionDto.options
      .map((option) => option.trim())
      .filter((option) => option.length > 0);

    if (options.length < 2) {
      throw new BadRequestException('Each question must include at least two options.');
    }

    const answer = this.resolveAnswer(createQuestionDto.answer, options);

    return {
      topicId: createQuestionDto.topicId,
      question: createQuestionDto.question.trim(),
      options,
      answer,
      explanation: createQuestionDto.explanation.trim(),
      difficulty: createQuestionDto.difficulty ?? QuestionDifficulty.MEDIUM,
      year: createQuestionDto.year ?? null,
    };
  }

  private resolveAnswer(answer: string, options: string[]) {
    const normalizedAnswer = answer.trim();

    const matchedOption = options.find(
      (option) => option.toLowerCase() === normalizedAnswer.toLowerCase(),
    );

    if (matchedOption) {
      return matchedOption;
    }

    if (normalizedAnswer.length === 1) {
      const optionIndex = normalizedAnswer.toUpperCase().charCodeAt(0) - 65;

      if (optionIndex >= 0 && optionIndex < options.length) {
        return options[optionIndex];
      }
    }

    throw new BadRequestException(
      'The correct answer must match one of the provided options or use an option letter such as A or B.',
    );
  }

  private async ensureTopicsExist(topicIds: number[]) {
    const topics = await this.topicsRepository.find({
      where: {
        id: In(topicIds),
      },
      select: {
        id: true,
      },
    });

    if (topics.length !== topicIds.length) {
      throw new NotFoundException('One or more topics were not found.');
    }
  }

  private handleQuestionWriteError(error: unknown): never {
    if (isUniqueConstraintViolation(error)) {
      throw new ConflictException('This question already exists for the selected topic.');
    }

    if (isForeignKeyViolation(error)) {
      throw new BadRequestException('The selected topic is invalid.');
    }

    throw error;
  }
}
