import { EGender, ERole } from 'src/auth/enums';
import { Post } from 'src/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: '50', nullable: false })
  name: string;
  @Column({ type: 'enum', enum: ERole, default: ERole.USER, nullable: false })
  role: string;
  @Column({ type: 'enum', enum: EGender, nullable: false })
  gender: string;
  @Column({ type: 'varchar', default: 'unknown' })
  image: string;
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
  @Column('int', { array: true, nullable: true })
  friends: number[];
  @PrimaryColumn()
  @Column({ type: 'varchar', nullable: false, length: 50 })
  email: string;
  @Column({ type: 'varchar', nullable: false })
  password: string;
  @Column({ type: 'int', nullable: false })
  age: number;
  @OneToMany(() => Post, (post) => post.user, { eager: true })
  posts: Post[];
}
