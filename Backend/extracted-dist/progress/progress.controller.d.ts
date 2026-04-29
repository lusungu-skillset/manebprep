import { CreateProgressDto } from './dto/create-progress.dto';
import { GetProgressQueryDto } from './dto/get-progress-query.dto';
import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    create(createProgressDto: CreateProgressDto): Promise<import("./entities/progress.entity").Progress>;
    findAll(query: GetProgressQueryDto): Promise<{
        data: import("./entities/progress.entity").Progress[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
}
