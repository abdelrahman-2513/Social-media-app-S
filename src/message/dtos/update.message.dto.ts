import { IsNumber, IsString } from 'class-validator';

export class UpdateMessageDTO {
  @IsString()
  content?: string;
}
