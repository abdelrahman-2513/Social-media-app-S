import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateRequestDTO } from './dtos';
import { RequestService } from './request.service';
import { Request, Response } from 'express';
import { IRequest } from './interfaces/request.interface';

@Controller('request')
export class RequestController {
  constructor(private readonly requestSVC: RequestService) {}
  @Post()
  async createRequest(@Body() newReq: CreateRequestDTO, @Res() res: Response) {
    try {
      const newRequest: IRequest =
        await this.requestSVC.createNewRequest(newReq);
      res.send(newReq).status(201);
    } catch (err) {
      console.log(err);
      res.send('Cannot send Request').status(404);
    }
  }
  @Get('/requests')
  async getAllRequests(@Res() res: Response) {
    try {
      const requests: IRequest[] = await this.requestSVC.getAllRequests();
      res.send(requests).status(200);
    } catch (err) {
      console.log(err);
      res.send('Try again later!').status(404);
    }
  }
  @Get('/myRequest')
  async getMyRequests(@Req() req: Request, @Res() res: Response) {
    try {
      const myRequests = await this.requestSVC.getUserRequests(
        req['user'].email,
      );
      res.send(myRequests).status(200);
    } catch (err) {
      console.log(err);
      res.send('Cannot get your requests now!').status(404);
    }
  }
  @Post('acceptRequest/:id')
  async acceptRequest(@Param('id') id: number, @Res() res: Response) {
    try {
      const acceptRequest: string = await this.requestSVC.acceptRequest(id);
      res.send(acceptRequest).status(200);
    } catch (err) {
      console.log(err);
      res.send('Cannot accept request!').status(404);
    }
  }
  @Delete('/:id')
  async removeRequest(@Param('id') id: number, @Res() res: Response) {
    try {
      const removedMessage: string = await this.requestSVC.deleteRequest(id);
      res.send(removedMessage).status(200);
    } catch (err) {
      console.log(err);
      res.send('Try again later!').status(404);
    }
  }
  @Post('/removeFriend/:friendId')
  async removeFriend(
    @Param('friendId') friendId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const removedMessage: string = await this.requestSVC.removeFriend(
        req['user'].id,
        friendId,
      );
      return res.send(removedMessage).status(200);
    } catch (err) {
      console.log(err);
      res.send('Try again later!').status(404);
    }
  }
}
