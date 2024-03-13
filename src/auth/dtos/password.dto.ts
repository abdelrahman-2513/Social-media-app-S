import { IsString } from "class-validator";

export class UpdatePasswordDTO{
    @IsString()
    currentPassword: string;
    @IsString()
    newPassword: string;
    @IsString()
    confirmPassword: string;
}