import { Repository } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { GetProgressQueryDto } from './dto/get-progress-query.dto';
import { Progress } from './entities/progress.entity';
export declare class ProgressService {
    private readonly progressRepository;
    private readonly questionsRepository;
    constructor(progressRepository: Repository<Progress>, questionsRepository: Repository<Question>);
    create(createProgressDto: CreateProgressDto): Promise<Progress>;
    findAll(query: GetProgressQueryDto): Promise<{
        data: Progress[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
}
