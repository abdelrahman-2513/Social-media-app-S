import { IsString } from 'class-validator';

export class CreateConversationDTO {
  @IsString()
  name: string;
}
