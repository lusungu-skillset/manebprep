import type { CreateQuestionInput } from '@shared/form-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { QuestionDifficulty } from '../enums/question-difficulty.enum';

export class CreateQuestionDto implements CreateQuestionInput {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  topicId!: number;

  @IsString()
  @MinLength(10)
  question!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  options!: string[];

  @IsString()
  @MinLength(1)
  answer!: string;

  @IsString()
  @MinLength(4)
  explanation!: string;

  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number | null;
}
