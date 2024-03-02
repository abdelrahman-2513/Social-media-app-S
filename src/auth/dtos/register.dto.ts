import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { EGender, ERole } from '../enums';

export class SignupDTO {
  @IsString()
  name: string;
  @IsString()
  @IsEnum(ERole)
  role: string;
  @IsString()
  @IsEnum(EGender)
  gender: string;
  @IsOptional()
  image: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsInt()
  age: number;
}
