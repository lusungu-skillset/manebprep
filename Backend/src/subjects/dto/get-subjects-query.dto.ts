import { Type } from 'class-transformer';
import { IsIn, IsISO8601, IsOptional } from 'class-validator';

export class GetSubjectsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn([1, 2, 3, 4])
  form?: number;

  @IsOptional()
  @IsISO8601()
  updatedAfter?: string;
}
