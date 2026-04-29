import type { UpdateSubjectInput } from '@shared/form-types';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSubjectDto implements UpdateSubjectInput {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsIn([1, 2, 3, 4])
  form?: 1 | 2 | 3 | 4;
}
