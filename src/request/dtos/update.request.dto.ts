import { IsBoolean } from 'class-validator';

export class UpdateRequestDTO {
  @IsBoolean()
  accepted: boolean;
}
