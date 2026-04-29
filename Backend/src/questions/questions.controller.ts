import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminKeyGuard } from '../common/guards/admin-key.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { DownloadQuestionsQueryDto } from './dto/download-questions-query.dto';
import { GetQuestionsQueryDto } from './dto/get-questions-query.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('bulk')
  @UseGuards(AdminKeyGuard)
  bulkCreate(
    @Body(new ParseArrayPipe({ items: CreateQuestionDto }))
    createQuestionDtos: CreateQuestionDto[],
  ) {
    return this.questionsService.bulkCreate(createQuestionDtos);
  }

  @Post()
  @UseGuards(AdminKeyGuard)
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Get('download')
  downloadBySubject(@Query() query: DownloadQuestionsQueryDto) {
    return this.questionsService.downloadBySubject(query);
  }

  @Get()
  findAll(@Query() query: GetQuestionsQueryDto) {
    return this.questionsService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(AdminKeyGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(AdminKeyGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.remove(id);
  }
}
