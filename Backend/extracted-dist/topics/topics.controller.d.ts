import { CreateTopicDto } from './dto/create-topic.dto';
import { GetTopicsQueryDto } from './dto/get-topics-query.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topics.service';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    create(createTopicDto: CreateTopicDto): Promise<import("./entities/topic.entity").Topic>;
    findAll(query: GetTopicsQueryDto): Promise<{
        data: import("./entities/topic.entity").Topic[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    update(id: number, updateTopicDto: UpdateTopicDto): Promise<import("./entities/topic.entity").Topic>;
    remove(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
}
