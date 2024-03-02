import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'int', nullable: false })
  fromUserId: number;

  @Column({ type: 'int', nullable: false })
  toUserId: number;

  // to get all the entity data without using any another queries

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ type: 'bool', default: false })
  accepted: boolean;
}
