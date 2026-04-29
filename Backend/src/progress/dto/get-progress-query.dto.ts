import { IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class GetProgressQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  userId?: string;

  @IsOptional()
  @IsISO8601()
  updatedAfter?: string;
}
