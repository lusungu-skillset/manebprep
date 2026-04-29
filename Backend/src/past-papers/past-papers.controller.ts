import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PastPapersService } from './past-papers.service';
import { CreatePastPaperDto } from './dto/create-past-paper.dto';
import { UpdatePastPaperDto } from './dto/update-past-paper.dto';
import { AdminKeyGuard } from '../common/guards/admin-key.guard';

@Controller('past-papers')
export class PastPapersController {
  constructor(private readonly pastPapersService: PastPapersService) {}

  /**
   * Get all past papers (public endpoint)
   * Query parameters for filtering:
   * - form: 1, 2, 3, or 4
   * - year: exam year
   */
  @Get()
  async findAll(
    @Query('form') form?: string,
    @Query('year') year?: string,
  ) {
    if (form && year) {
      const formNum = parseInt(form, 10) as 1 | 2 | 3 | 4;
      const yearNum = parseInt(year, 10);
      return this.pastPapersService.findByFormAndYear(formNum, yearNum);
    }

    if (form) {
      const formNum = parseInt(form, 10) as 1 | 2 | 3 | 4;
      return this.pastPapersService.findByForm(formNum);
    }

    return this.pastPapersService.findAll();
  }

  /**
   * Get available years for a form
   */
  @Get('years/:form')
  async getYears(@Param('form', ParseIntPipe) form: number) {
    const formNum = form as 1 | 2 | 3 | 4;
    return this.pastPapersService.getYearsByForm(formNum);
  }

  /**
   * Get seasons for a form and year
   */
  @Get('seasons/:form/:year')
  async getSeasons(
    @Param('form', ParseIntPipe) form: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    const formNum = form as 1 | 2 | 3 | 4;
    return this.pastPapersService.getSeasonsByFormAndYear(formNum, year);
  }

  /**
   * Get a specific past paper with questions
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const pastPaper = await this.pastPapersService.findOne(id);
    if (!pastPaper) {
      return { error: `Past paper with ID ${id} not found` };
    }
    return pastPaper;
  }

  /**
   * Create a new past paper (admin only)
   * Requires x-admin-key header
   */
  @Post()
  @UseGuards(AdminKeyGuard)
  async create(@Body() createPastPaperDto: CreatePastPaperDto) {
    return this.pastPapersService.create(createPastPaperDto);
  }

  /**
   * Update a past paper (admin only)
   * Requires x-admin-key header
   */
  @Patch(':id')
  @UseGuards(AdminKeyGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePastPaperDto: UpdatePastPaperDto,
  ) {
    return this.pastPapersService.update(id, updatePastPaperDto);
  }

  /**
   * Delete a past paper (admin only)
   * Requires x-admin-key header
   */
  @Delete(':id')
  @UseGuards(AdminKeyGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.pastPapersService.remove(id);
  }
}
