import type { CreateQuestionInput } from '@shared/form-types';
import { QuestionDifficulty } from '../enums/question-difficulty.enum';
export declare class CreateQuestionDto implements CreateQuestionInput {
    topicId: number;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    difficulty?: QuestionDifficulty;
    year?: number | null;
}
