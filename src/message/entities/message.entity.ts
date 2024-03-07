import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({ type: 'bool', default: false })
  edited: boolean;

  @Column({ type: 'bool', default: false })
  deleted: boolean;
  @Column({ name: 'conversationid', type: 'int', nullable: false })
  conversationId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinTable()
  user: User;
  @ManyToOne(() => Conversation)
  @JoinTable()
  conversation: Conversation;
}
