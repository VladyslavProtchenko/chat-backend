import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/users/user.entity';
import { ChatsModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Chat]),
    forwardRef(() => ChatsModule),
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
