import { IsInt, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsString()
  content: string;
  @IsInt()
  postId: string;
}
