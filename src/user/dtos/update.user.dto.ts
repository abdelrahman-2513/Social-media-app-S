import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  name?: string;

  image?: string;

  email?: string;
  age?: number;
}
