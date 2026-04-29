import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { GetProgressQueryDto } from './dto/get-progress-query.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  findAll(@Query() query: GetProgressQueryDto) {
    return this.progressService.findAll(query);
  }
}
