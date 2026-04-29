import { Type } from 'class-transformer';
import { IsISO8601, IsInt, IsOptional, Min } from 'class-validator';

export class GetTopicsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  subjectId?: number;

  @IsOptional()
  @IsISO8601()
  updatedAfter?: string;
}
