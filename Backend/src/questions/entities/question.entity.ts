import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampedEntity } from '../../common/entities/timestamped.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { Topic } from '../../topics/entities/topic.entity';
import { QuestionDifficulty } from '../enums/question-difficulty.enum';

@Entity()
@Index(['topicId'])
export class Question extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  topicId!: number;

  @ManyToOne(() => Topic, (topic) => topic.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topicId' })
  topic!: Topic;

  @Column({ type: 'text' })
  question!: string;

  @Column({ type: 'jsonb' })
  options!: string[];

  @Column({ length: 255 })
  answer!: string;

  @Column({ type: 'text' })
  explanation!: string;

  @Column({ type: 'int', nullable: true })
  year?: number | null;

  @Column({
    type: 'enum',
    enum: QuestionDifficulty,
    default: QuestionDifficulty.MEDIUM,
  })
  difficulty!: QuestionDifficulty;

  @OneToMany(() => Progress, (progress) => progress.question)
  progressEntries!: Progress[];
}
