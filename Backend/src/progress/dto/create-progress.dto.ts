import { Type } from 'class-transformer';
import { IsISO8601, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProgressDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  userId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  questionId!: number;

  @IsString()
  selectedAnswer!: string;

  @IsOptional()
  @IsISO8601()
  timestamp?: string;
}
