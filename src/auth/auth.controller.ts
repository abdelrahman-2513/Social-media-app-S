import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { Request, Response } from 'express';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { SignupDTO } from './dtos/register.dto';
import { UpdateUserDTO } from 'src/user/dtos';
import { UpdatePasswordDTO } from './dtos/password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export class LogDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authSVC: AuthService) {}
  @Public()
  @Post('/login')
  async login(@Body() userData: LogDTO, @Res() res: Response) {
    // try {
    //   const user = await this.authSVC.signIn(
    //     userData.email,
    //     userData.password,
    //     res,
    //   );
    //   res.status(200).send(user);
    // } catch (err) {
    //   console.log(err);
    // }
    return await this.authSVC.signIn(userData.email, userData.password, res);
  }

  @Public()
  @Post('/signup')
  async signup(@Body() userData: SignupDTO, @Res() res: Response) {
    return await this.authSVC.signUp(userData, res);
  }

  @Post('/updateMe')
  @UseInterceptors(FileInterceptor('image'))
  async updateMyData(
    @Body() userData: UpdateUserDTO,
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = await this.authSVC.UpdateMe(userData, file, req);
      res.send(user).status(201);
    } catch (err) {
      res.send(err.message).status(404);
    }
  }
  @Post('/updatePassword')
  async updateMyPassword(
    @Body() passwordData: UpdatePasswordDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authSVC.UpdateMyPassword(passwordData, req);
      res.send(user).status(201);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
}
