import { Repository } from 'typeorm';
import { Subject } from '../subjects/entities/subject.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { GetTopicsQueryDto } from './dto/get-topics-query.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';
export declare class TopicsService {
    private readonly topicsRepository;
    private readonly subjectsRepository;
    constructor(topicsRepository: Repository<Topic>, subjectsRepository: Repository<Subject>);
    create(createTopicDto: CreateTopicDto): Promise<Topic>;
    findAll(query: GetTopicsQueryDto): Promise<{
        data: Topic[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    update(id: number, updateTopicDto: UpdateTopicDto): Promise<Topic>;
    remove(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
    private findOneOrThrow;
    private findTopicDetailsOrThrow;
    private ensureSubjectExists;
}
