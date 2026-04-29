import { TimestampedEntity } from '../../common/entities/timestamped.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { Topic } from '../../topics/entities/topic.entity';
import { QuestionDifficulty } from '../enums/question-difficulty.enum';
export declare class Question extends TimestampedEntity {
    id: number;
    topicId: number;
    topic: Topic;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
    year?: number | null;
    difficulty: QuestionDifficulty;
    progressEntries: Progress[];
}
