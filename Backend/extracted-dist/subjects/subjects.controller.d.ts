import { CreateSubjectDto } from './dto/create-subject.dto';
import { GetSubjectsQueryDto } from './dto/get-subjects-query.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsService } from './subjects.service';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(createSubjectDto: CreateSubjectDto): Promise<import("./entities/subject.entity").Subject>;
    findAll(query: GetSubjectsQueryDto): Promise<{
        data: import("./entities/subject.entity").Subject[];
        count: number;
        syncedAt: string;
        lastUpdatedAt: string | null;
    }>;
    update(id: number, updateSubjectDto: UpdateSubjectDto): Promise<import("./entities/subject.entity").Subject>;
    remove(id: number): Promise<{
        id: number;
        deleted: boolean;
    }>;
}
