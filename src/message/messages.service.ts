import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './create-message.dto';
import { User } from 'src/users/user.entity';
import { Chat } from 'src/chat/chat.entity';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { message, user_id, chat_id } = createMessageDto;
    const user = await this.usersRepository.findOne({
      where: { id: user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    const chat = await this.chatsRepository.findOne({ where: { id: chat_id } });
    if (!chat) throw new NotFoundException('Chat not found');

    const newMessage = this.messagesRepository.create({
      message,
      user,
      chat,
    });
    const savedMessage = await this.messagesRepository.save(newMessage);
    console.log(savedMessage, 'message sent successfully');
    return savedMessage;
  }

  async findByChat(chatId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { chat: { id: chatId } },
      select: {
        id: true,
        message: true,
        timestamp: true,
        user: {
          id: true,
          username: true,
        },
      },
      relations: ['user'],
      order: {
        timestamp: 'DESC',
      },
    });
  }
}
