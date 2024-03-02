import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateConversationDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  participantsId?: number[];
}
