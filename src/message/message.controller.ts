import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateMessageDTO, UpdateMessageDTO } from './dtos';
import { Response } from 'express';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly msgSVC: MessageService) {}
  @Post('')
  async createMessage(@Body() newMsg: CreateMessageDTO, @Res() res: Response) {
    try {
      const newMessage = await this.msgSVC.createMessage(newMsg);
      res.send(newMessage).status(201);
    } catch (err) {
      console.log(err);
      res.send('Canbnot create message').status(404);
    }
  }

  @Get('')
  async getAllMssages(@Res() res: Response) {
    try {
      const messages = await this.msgSVC.getAllMessages();
      res.send(messages).status(200);
    } catch (err) {
      console.log(err);
      res.send('Cannot get messages!').status(404);
    }
  }
  @Get('conversation/:convId')
  async getConvbersationMessages(
    @Param('convId') id: number,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Res() res: Response,
  ) {
    try {
      const messages = await this.msgSVC.getConversationMessage(
        Number(id),
        page,
        pageSize,
      );
      res.send(messages).status(200);
    } catch (err) {
      console.log(err);
      res.send('Cannot get messages!').status(404);
    }
  }

  @Patch('/:id')
  async updateMessage(
    @Param('id') id: number,
    @Res() res: Response,
    @Body() updateMsg: UpdateMessageDTO,
  ) {
    try {
      const updated = await this.msgSVC.updateMessage(id, updateMsg.content);
      res.send(updated).status(203);
    } catch (err) {
      console.log(err);
      res.send('Cannot update messages!').status(404);
    }
  }
  @Patch('delete/:id')
  async deleteMessage(@Param('id') id: number, @Res() res: Response) {
    try {
      const updated = await this.msgSVC.deleteMessage(id);
      res.send(updated).status(203);
    } catch (err) {
      console.log(err);
      res.send('Cannot update messages!').status(404);
    }
  }
  @Delete('conv/:id')
  async deleteConversationMessages(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.msgSVC.deleteConvMessages(id);
      res.send(updated).status(203);
    } catch (err) {
      console.log(err);
      res.send('Cannot update messages!').status(404);
    }
  }
  @Get('/conversationMessages/:id')
  async getNewestMessages(
    @Param('id') id: string,
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    try {
      const newwestMessages = await this.msgSVC.findNewestByConvId(
        Number(id),
        page,
        pageSize,
      );
      res.send(newwestMessages).status(200);
    } catch (err) {
      console.log(err);
      res.send('Cannot update messages!').status(404);
    }
  }
}
