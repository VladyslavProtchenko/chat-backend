import { Message } from 'src/message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: () => 'NOW()' })
  created_at: Date;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @UpdateDateColumn()
  updated_at: Date;
}
