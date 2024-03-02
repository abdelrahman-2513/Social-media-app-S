import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateConversationDTO, UpdateConversationDTO } from './dtos';
import { ConversationService } from './conversation.service';
import { Request, Response } from 'express';
import { IConversation } from './interfaces/conversation.interface.dto';

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
  @Get('ById/:id')
  async getConversationById(@Param('id') id: number, @Res() res: Response) {
    try {
      const newConversation =
        await this.conversationSVC.findConversationById(id);
      res.send(newConversation).status(200);
    } catch (err) {
      res.send(err).status(400);
    }
  }
  @Get('ByName/:name')
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
  @Get('/myConversations')
  async getMyConversations(@Req() req: Request, @Res() res: Response) {
    try {
      const myConversations: IConversation[] =
        await this.conversationSVC.getUserConversations(req['user'].id);
      res.send(myConversations).status(200);
    } catch (err) {
      console.log(err);
      res.send('Cannot get your conversations now!');
    }
  }

  @Post('/:id/addUser')
  async addUserToConversation(
    @Param('id') id: number,
    @Body() updateBody: UpdateConversationDTO,
    @Res() res: Response,
  ) {
    try {
      const addedMessage: string =
        await this.conversationSVC.addUserToConversation(id, updateBody);
      res.send(addedMessage).status(201);
    } catch (err) {
      console.log(err);
      res.send('Cannot add user now!').status(404);
    }
  }
  @Post('/:id/removeUser/:userId')
  async removeUserFromConversation(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    try {
      const removedMessage: string =
        await this.conversationSVC.removeUserFromConversation(id, userId);
      res.send(removedMessage).status(201);
    } catch (err) {
      console.log(err);
      res.send('Cannot add user now!').status(404);
    }
  }
}
