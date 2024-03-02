import { IsInt } from 'class-validator';

export class CreateRequestDTO {
  @IsInt()
  fromUserId: number;
  @IsInt()
  toUserId: number;
}
