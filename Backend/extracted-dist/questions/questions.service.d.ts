import { Repository } from 'typeorm';
import { Subject } from '../subjects/entities/subject.entity';
import { Topic } from '../topics/entities/topic.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { DownloadQuestionsQueryDto } from './dto/download-questions-query.dto';
import { GetQuestionsQueryDto } from './dto/get-questions-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
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
export declare class QuestionsService {
    private readonly questionsRepository;
    private readonly subjectsRepository;
    private readonly topicsRepository;
    constructor(questionsRepository: Repository<Question>, subjectsRepository: Repository<Subject>, topicsRepository: Repository<Topic>);
    bulkCreate(createQuestionDtos: CreateQuestionDto[]): Promise<{
        data: QuestionResponseItem[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    create(createQuestionDto: CreateQuestionDto): Promise<QuestionResponseItem>;
    findAll(query: GetQuestionsQueryDto): Promise<{
        data: QuestionResponseItem[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<QuestionResponseItem>;
    remove(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
    downloadBySubject(query: DownloadQuestionsQueryDto): Promise<{
        subject: {
            id: number;
            name: string;
            form: number;
            updatedAt: Date;
        };
        topics: {
            id: number;
            name: string;
            questionCount: number;
            questions: QuestionResponseItem[];
        }[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string;
    }>;
    private mapQuestions;
    private findQuestionOrThrow;
    private findMappedQuestionById;
    private findQuestionsByIds;
    private normalizeQuestionValues;
    private resolveAnswer;
    private ensureTopicsExist;
    private handleQuestionWriteError;
}
export {};
