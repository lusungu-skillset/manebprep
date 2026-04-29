import type { CreateSubjectInput } from '@shared/form-types';
import { Type } from 'class-transformer';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSubjectDto implements CreateSubjectInput {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Type(() => Number)
  @IsIn([1, 2, 3, 4])
  form!: 1 | 2 | 3 | 4;
}
