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
import { LikeService } from './like.service';
import { Request, Response } from 'express';
import { CreateLikeDTO } from './dtos/create.like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeSVC: LikeService) {}
  @Post('/post/:id')
  async createLike(
    @Param('id') postId: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const likeData = new CreateLikeDTO();
      likeData.postId = postId;
      const newLike = await this.likeSVC.createLike(likeData, req);
      res.status(201).send(newLike);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }

  @Get('/:id')
  async getLike(@Param('id') likeId: number, @Res() res: Response) {
    try {
      const Like = await this.likeSVC.getLike(likeId);
      res.status(200).send(Like);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
  @Delete('/:id')
  async deleteLike(@Param('id') likeId: number, @Res() res: Response) {
    try {
      const newLike = await this.likeSVC.deleteLike(likeId);
      res.status(204).send('deleted');
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
}
