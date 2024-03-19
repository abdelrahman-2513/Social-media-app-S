import { IsNumber } from 'class-validator';

export class CreateLikeDTO {
  @IsNumber()
  postId: number;
}
