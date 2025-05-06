import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from '../message/message.entity';
import { Post } from 'src/posts/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Message, (message) => message.user, {
    onDelete: 'CASCADE',
  })
  messages: Message[];

  @OneToMany(() => Post, (post) => post.author, {
    onDelete: 'CASCADE',
  })
  posts: Post[];
}
