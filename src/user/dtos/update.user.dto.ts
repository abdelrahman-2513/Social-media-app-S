import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  name: string;
  @IsString()
  role: string;
  @IsOptional()
  image: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}
