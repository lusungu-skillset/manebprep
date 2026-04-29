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
import { Question } from '../../questions/entities/question.entity';
import { Subject } from '../../subjects/entities/subject.entity';

@Entity()
@Index(['subjectId'])
@Index(['subjectId', 'name'], { unique: true })
export class Topic extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  name!: string;

  @Column()
  subjectId!: number;

  @ManyToOne(() => Subject, (subject) => subject.topics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subjectId' })
  subject!: Subject;

  @OneToMany(() => Question, (question) => question.topic)
  questions!: Question[];
}
