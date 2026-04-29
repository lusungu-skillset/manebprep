import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampedEntity } from '../../common/entities/timestamped.entity';
import { Topic } from '../../topics/entities/topic.entity';

@Entity()
@Index(['name', 'form'], { unique: true })
@Index(['form'])
export class Subject extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'int' })
  form!: number;

  @OneToMany(() => Topic, (topic) => topic.subject)
  topics!: Topic[];
}
