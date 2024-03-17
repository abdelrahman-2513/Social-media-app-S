import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateUserDTO } from './dtos';
import { Response } from 'express';
import { UserService } from './user.service';
import { IUser } from './interfaces';

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

  @Get('/:id')
  async getUser(@Param('id') userId: number, @Res() response: Response) {
    try {
      const user: IUser = await this.UserSVC.findUserById(userId);
      response.status(200).send(user);
    } catch (err) {
      console.log(err);
      response.status(404).send(err.message);
    }
  }
}
