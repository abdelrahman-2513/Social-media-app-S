import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CreateConversationDTO, UpdateConversationDTO } from './dtos';
import { ConversationService } from './conversation.service';
import { Response } from 'express';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationSVC: ConversationService) {}
  @Post('')
  async createConversation(
    @Body() newConv: CreateConversationDTO,
    @Res() res: Response,
  ) {
    try {
      const newConversation =
        await this.conversationSVC.createConversation(newConv);
      res.send(newConversation).status(201);
    } catch (err) {
      res.send(err).status(400);
    }
  }
  @Get('')
  async getConversations(@Res() res: Response) {
    try {
      const newConversation = await this.conversationSVC.findAllConversations();
      res.send(newConversation).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  }
  @Get('/:id')
  async getConversationById(@Param('id') id: number, @Res() res: Response) {
    try {
      const newConversation =
        await this.conversationSVC.findConversationById(id);
      res.send(newConversation).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  }
  @Get('/:name')
  async getConversationByName(
    @Param('name') name: string,
    @Res() res: Response,
  ) {
    try {
      const newConversation =
        await this.conversationSVC.findConversationByName(name);
      res.send(newConversation).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  }
  @Patch('/:id')
  async updateConversation(
    @Param('id') id: number,
    @Body() updateData: UpdateConversationDTO,
    @Res() res: Response,
  ) {
    try {
      const newConversation = await this.conversationSVC.updateConversation(
        id,
        updateData,
      );
      res.send(newConversation).status(304);
    } catch (err) {
      res.send(err).status(400);
    }
  }
  @Delete('/:name')
  async deleteConversation(@Param('name') name: string, @Res() res: Response) {
    try {
      await this.conversationSVC.deleteConversation(name);
      res.send('Deleted Successfully!').status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  }
}
