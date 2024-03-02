import { IsString } from 'class-validator';

export class UpdateConversationDTO {
  @IsString()
  name: string;
}
