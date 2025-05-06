// chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './create-chat.dto';
// import { User } from 'src/users/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { title: createChatDto.title },
    });
    console.log(chat, 'chat');
    if (chat) {
      return chat;
    }
    const createChat = this.chatRepository.create(createChatDto);
    const newChat = await this.chatRepository.save(createChat);
    console.log(newChat, 'newChat');
    return newChat;
  }

  async getChatWithMessages(chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['messages', 'messages.user'],
      select: {
        messages: {
          id: true,
          message: true,
          timestamp: true,

          user: {
            username: true,
          },
        },
      },
      order: {
        messages: {
          timestamp: 'ASC',
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async getChats(): Promise<Chat[]> {
    return await this.chatRepository.find();
  }
}
