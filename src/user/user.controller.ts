import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDTO } from './dtos';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private UserSVC: UserService) {}
  @Post('')
  async createUser(@Body() userData: CreateUserDTO, @Res() response: Response) {
    try {
      const newUser = await this.UserSVC.createUser(userData);
      response.send(newUser).status(201);
    } catch (err) {
      response.send(err.message).status(404);
    }
  }
}
