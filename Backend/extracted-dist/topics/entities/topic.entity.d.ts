import { TimestampedEntity } from '../../common/entities/timestamped.entity';
import { Question } from '../../questions/entities/question.entity';
import { Subject } from '../../subjects/entities/subject.entity';
export declare class Topic extends TimestampedEntity {
    id: number;
    name: string;
    subjectId: number;
    subject: Subject;
    questions: Question[];
}
