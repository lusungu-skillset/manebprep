import { Type } from 'class-transformer';
import { IsIn, IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DownloadQuestionsQueryDto {
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @Type(() => Number)
  @IsIn([1, 2, 3, 4])
  form!: number;

  @IsOptional()
  @IsISO8601()
  updatedAfter?: string;
}
