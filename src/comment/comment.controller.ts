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
import { CommentService } from './comment.service';
import { CreateCommentDTO, UpdateCommentDTO } from './dtos';
import { Request, Response } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentSVC: CommentService) {}

  @Post('')
  async createComment(
    @Body() commentData: CreateCommentDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const newComment = await this.commentSVC.createComment(commentData, req);
      res.status(201).send(newComment);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
  @Patch('/:id')
  async updateComment(
    @Body() commentData: UpdateCommentDTO,
    @Param('id') commId: number,
    @Res() res: Response,
  ) {
    try {
      const updatedComment = await this.commentSVC.updateComment(
        commId,
        commentData,
      );
      res.status(201).send(updatedComment);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
  @Get('/:id')
  async getComment(@Param('id') commId: number, @Res() res: Response) {
    try {
      const comment = await this.commentSVC.getComment(commId);
      res.status(200).send(comment);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
  @Delete('/:id')
  async deleteComment(@Param('id') commId: number, @Res() res: Response) {
    try {
      const newComment = await this.commentSVC.deleteComment(commId);
      res.status(204).send('deleted');
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
}
