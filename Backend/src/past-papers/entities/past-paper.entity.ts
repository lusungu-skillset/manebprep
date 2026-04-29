import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TimestampedEntity } from '../../common/entities/timestamped.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('past_papers')
@Index(['form', 'year'])
@Index(['form'])
export class PastPaper extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
    comment: 'Form level: 1, 2, 3, or 4',
  })
  form!: 1 | 2 | 3 | 4;

  @Column({
    type: 'int',
    comment: 'Exam year (e.g., 2024, 2023)',
  })
  year!: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Exam season (e.g., June, November)',
  })
  season?: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Past paper title (e.g., "June 2024 Form 4 Examination")',
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Optional description of the past paper',
  })
  description?: string | null;

  @Column({
    type: 'int',
    comment: 'Total number of questions in this past paper',
  })
  questionCount!: number;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Array of question IDs included in this past paper',
  })
  questionIds?: number[] | null;

  @ManyToMany(() => Question)
  @JoinTable({
    name: 'past_paper_questions',
    joinColumn: { name: 'past_paper_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'question_id', referencedColumnName: 'id' },
  })
  questions?: Question[];
}
