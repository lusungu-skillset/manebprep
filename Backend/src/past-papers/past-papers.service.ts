import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PastPaper } from './entities/past-paper.entity';
import { CreatePastPaperDto } from './dto/create-past-paper.dto';
import { UpdatePastPaperDto } from './dto/update-past-paper.dto';

@Injectable()
export class PastPapersService {
  constructor(
    @InjectRepository(PastPaper)
    private readonly pastPaperRepository: Repository<PastPaper>,
  ) {}

  /**
   * Create a new past paper
   */
  async create(createPastPaperDto: CreatePastPaperDto): Promise<PastPaper> {
    const pastPaper = this.pastPaperRepository.create({
      ...createPastPaperDto,
      questionCount: createPastPaperDto.questionIds.length,
    });
    return this.pastPaperRepository.save(pastPaper);
  }

  /**
   * Get all past papers
   */
  async findAll(): Promise<PastPaper[]> {
    return this.pastPaperRepository.find({
      relations: ['questions'],
      order: { year: 'DESC', season: 'ASC' },
    });
  }

  /**
   * Get past papers by form
   */
  async findByForm(form: 1 | 2 | 3 | 4): Promise<PastPaper[]> {
    return this.pastPaperRepository.find({
      where: { form },
      relations: ['questions'],
      order: { year: 'DESC', season: 'ASC' },
    });
  }

  /**
   * Get past papers by form and year
   */
  async findByFormAndYear(
    form: 1 | 2 | 3 | 4,
    year: number,
  ): Promise<PastPaper[]> {
    return this.pastPaperRepository.find({
      where: { form, year },
      relations: ['questions'],
      order: { season: 'ASC' },
    });
  }

  /**
   * Get a specific past paper
   */
  async findOne(id: number): Promise<PastPaper | null> {
    return this.pastPaperRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
  }

  /**
   * Update a past paper
   */
  async update(
    id: number,
    updatePastPaperDto: UpdatePastPaperDto,
  ): Promise<PastPaper> {
    const pastPaper = await this.pastPaperRepository.findOne({ where: { id } });
    if (!pastPaper) {
      throw new Error(`Past paper with ID ${id} not found`);
    }

    // Only update questionCount if questionIds are provided
    const updatedData = {
      ...updatePastPaperDto,
      ...(updatePastPaperDto.questionIds && {
        questionCount: updatePastPaperDto.questionIds.length,
      }),
    };

    await this.pastPaperRepository.update(id, updatedData);
    return this.pastPaperRepository.findOne({
      where: { id },
      relations: ['questions'],
    }) as Promise<PastPaper>;
  }

  /**
   * Delete a past paper
   */
  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const result = await this.pastPaperRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Past paper with ID ${id} not found`);
    }
    return { success: true, message: `Past paper ${id} deleted successfully` };
  }

  /**
   * Get available years for a form
   */
  async getYearsByForm(form: 1 | 2 | 3 | 4): Promise<number[]> {
    const result = await this.pastPaperRepository
      .createQueryBuilder('pp')
      .select('DISTINCT pp.year', 'year')
      .where('pp.form = :form', { form })
      .orderBy('pp.year', 'DESC')
      .getRawMany();

    return result.map((r) => parseInt(r.year, 10));
  }

  /**
   * Get seasons for a form and year
   */
  async getSeasonsByFormAndYear(
    form: 1 | 2 | 3 | 4,
    year: number,
  ): Promise<string[]> {
    const result = await this.pastPaperRepository
      .createQueryBuilder('pp')
      .select('DISTINCT pp.season', 'season')
      .where('pp.form = :form', { form })
      .andWhere('pp.year = :year', { year })
      .getRawMany();

    return result
      .map((r) => r.season)
      .filter((s) => s !== null && s !== undefined);
  }
}
