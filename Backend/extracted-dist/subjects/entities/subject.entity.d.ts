import { TimestampedEntity } from '../../common/entities/timestamped.entity';
import { Topic } from '../../topics/entities/topic.entity';
export declare class Subject extends TimestampedEntity {
    id: number;
    name: string;
    form: number;
    topics: Topic[];
}
