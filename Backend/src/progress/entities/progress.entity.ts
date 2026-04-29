import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
@Index(['questionId'])
@Index(['userId'])
export class Progress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userId?: string | null;

  @Column()
  questionId!: number;

  @ManyToOne(() => Question, (question) => question.progressEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question!: Question;

  @Column({ length: 255 })
  selectedAnswer!: string;

  @Column({ default: false })
  isCorrect!: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;
}
