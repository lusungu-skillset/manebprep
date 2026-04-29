import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { GetSubjectsQueryDto } from './dto/get-subjects-query.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
export declare class SubjectsService {
    private readonly subjectsRepository;
    constructor(subjectsRepository: Repository<Subject>);
    create(createSubjectDto: CreateSubjectDto): Promise<Subject>;
    findAll(query: GetSubjectsQueryDto): Promise<{
        data: Subject[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<Subject>;
    remove(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
    private findOneOrThrow;
}
