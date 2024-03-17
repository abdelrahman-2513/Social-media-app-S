import { IsNumber, IsString } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  content: string;
}
