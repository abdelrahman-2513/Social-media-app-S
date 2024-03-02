import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsString,
} from 'class-validator';
import { Econversation } from 'src/auth/enums';

export class CreateConversationDTO {
  @IsString()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  participantsId: number[];

  @IsString()
  @IsEnum(Econversation)
  type: string;
}
