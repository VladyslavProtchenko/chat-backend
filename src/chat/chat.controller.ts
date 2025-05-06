import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { CreateChatDto } from './create-chat.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatService.getChatWithMessages(id);
  }

  @UseGuards(AuthGuard('jwt-cookie'))
  @Post()
  async create(
    @Body() createChatDto: CreateChatDto,
    @CurrentUser() user: User,
  ): Promise<Chat> {
    console.log(user, 'user from cookies');
    return this.chatService.createChat(createChatDto);
  }

  @Get()
  async getChats(): Promise<Chat[]> {
    return await this.chatService.getChats();
  }
}
