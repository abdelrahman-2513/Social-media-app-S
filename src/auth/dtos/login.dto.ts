import { IsEmail, IsNotEmpty } from 'class-validator';

export class LogDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
