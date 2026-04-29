import type { UpdateQuestionInput } from '@shared/form-types';
import { QuestionDifficulty } from '../enums/question-difficulty.enum';
export declare class UpdateQuestionDto implements UpdateQuestionInput {
    topicId?: number;
    question?: string;
    options?: string[];
    answer?: string;
    explanation?: string;
    difficulty?: QuestionDifficulty;
    year?: number | null;
}
