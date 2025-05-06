import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  message: string;

  @IsUUID()
  user_id: string;

  @IsUUID()
  chat_id: string;
}
