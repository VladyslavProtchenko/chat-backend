import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../message/messages.service';
import { CreateMessageDto } from '../message/create-message.dto';
import { Message } from '../message/message.entity';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Клиент подключен: ${client.id}`);
  }
  joinRoom(roomId: string, username: string, sender?: Socket) {
    sender.emit('user_joined', {
      message: `${username} joined the room`,
    });
  }
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() { roomId, username }: { roomId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    console.log(`Клиент ${client.id} присоединился к комнате ${roomId}`);
    this.joinRoom(roomId, username, client);
  }

  sendNewMessage(sender: Socket, message: Message) {
    const roomId = message.chat.id;
    this.server.in(roomId).emit('newMessage', message);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    try {
      const message = await this.messagesService.create(payload);
      if (!message) throw new Error('error with message');
      this.sendNewMessage(client, message);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: 'Failed to send message' };
    }
  }
}
