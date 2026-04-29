import { CreateQuestionDto } from './dto/create-question.dto';
import { DownloadQuestionsQueryDto } from './dto/download-questions-query.dto';
import { GetQuestionsQueryDto } from './dto/get-questions-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    bulkCreate(createQuestionDtos: CreateQuestionDto[]): Promise<{
        data: {
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
        }[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    create(createQuestionDto: CreateQuestionDto): Promise<{
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
            questions: {
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
            }[];
        }[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string;
    }>;
    findAll(query: GetQuestionsQueryDto): Promise<{
        data: {
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
        }[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
}
