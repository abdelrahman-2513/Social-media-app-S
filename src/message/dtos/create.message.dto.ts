import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDTO {
  @IsNumber()
  userId: number;

  @IsString()
  content: string;

  @IsNumber()
  convId: number;
}
