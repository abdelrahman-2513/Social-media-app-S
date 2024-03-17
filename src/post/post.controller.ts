import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDTO } from './dtos/create.post.dto';
import { Request, Response } from 'express';
import { IPost } from './interfaces/post.interface';
import { UpdatePostDTO } from './dtos/update.post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly PostSVC: PostService) {}

  @Post('')
  async createNewPost(
    @Body() postData: CreatePostDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const newPost: IPost = await this.PostSVC.createPost(postData, req);
      res.status(201).send(newPost);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }

  @Get('')
  async getAllPosts(@Res() res: Response) {
    try {
      const posts: IPost[] = await this.PostSVC.getAllPosts();
      res.status(200).send(posts);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }

  @Get('/user/:id')
  async getUserPosts(@Param('id') userId: number, @Res() res: Response) {
    try {
      const userPosts: IPost[] = await this.PostSVC.getUserPosts(
        Number(userId),
      );
      res.status(200).send(userPosts);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }

  @Get('/feeds')
  async getUserFeeds(
    @Res() res: Response,
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    try {
      const userFeeds: IPost[] = await this.PostSVC.getUserFeeds(
        req,
        Number(page),
        Number(pageSize),
      );
      res.status(200).send(userFeeds);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
  @Patch('/:id')
  async updatePost(
    @Param('id') postId: number,
    @Body() postData: UpdatePostDTO,
    @Res() res: Response,
  ) {
    try {
      const updatedPost: IPost = await this.PostSVC.updatePost(
        postId,
        postData,
      );
      res.status(201).send(updatedPost);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
  @Delete('/:id')
  async deletePost(@Param('id') postId: number, @Res() res: Response) {
    try {
      const deletedMessage: string = await this.PostSVC.deletePost(postId);
      res.status(204).send(deletedMessage);
    } catch (err) {
      console.log(err);
      res.status(404).send(err.message);
    }
  }
}
