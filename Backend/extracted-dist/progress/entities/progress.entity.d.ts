import { Question } from '../../questions/entities/question.entity';
export declare class Progress {
    id: number;
    userId?: string | null;
    questionId: number;
    question: Question;
    selectedAnswer: string;
    isCorrect: boolean;
    timestamp: Date;
}
