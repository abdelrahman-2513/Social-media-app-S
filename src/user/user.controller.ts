import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { IUser } from './interfaces';

@Controller('user')
export class UserController {
  constructor(private UserSVC: UserService) {}
  @Get('')
  async getUsers(
    @Query('name') searchQuery: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      console.log('from searchUsers');
      const users = await this.UserSVC.searchUsersByName(searchQuery, req);
      res.status(200).send(users);
    } catch (err) {
      res.send(err.message).status(404);
    }
  }
  @Post('')
  async createUser(@Body() userData: CreateUserDTO, @Res() response: Response) {
    try {
      const newUser = await this.UserSVC.createUser(userData);
      response.send(newUser).status(201);
    } catch (err) {
      response.send(err.message).status(404);
    }
  }

  @Get('/friends')
  async getUserFriends(@Req() req: Request, @Res() response: Response) {
    try {
      console.log('from get user friends');
      const friends: IUser[] = await this.UserSVC.getUserFriends(
        req['user'].id,
      );
      response.status(200).send(friends);
    } catch (err) {
      console.log(err);
      response.status(404).send(err.message);
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
