import { Econversation } from 'src/auth/enums';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['name'])
@Index(['created_at'])
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: Econversation,
    default: Econversation.DIRECT,
    nullable: false,
  })
  type: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  participants: User[];
}
