import { Injectable } from '@nestjs/common';
import { Like } from './entities/like.entity';
import { ILike } from './interfaces/like.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLikeDTO } from './dtos/create.like.dto';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Request } from 'express';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly LikeRep: Repository<Like>,
  ) {}

  /**
   * This function is used to create a Like
   * @Param LikeData:CreateLikeDTO
   * @Param req:Request
   * returns Like
   */
  async createLike(LikeData: CreateLikeDTO, req: Request): Promise<ILike> {
    try {
      const newLike = new Like();
      newLike.post = LikeData.postId as unknown as Post;
      newLike.user = req['user'].id as unknown as User;

      return await this.LikeRep.save(newLike);
    } catch (err) {
      console.log(err);
      throw new Error('Cannot create Like!');
    }
  }

  /**
   * This function is used to get Like
   * @Param likeId:number
   * returns Like
   */
  async getLike(likeId: number): Promise<ILike> {
    try {
      const Like: ILike = await this.LikeRep.findOneBy({
        id: likeId,
      });
      if (!Like) throw new Error('No Like by this ID!');
      return Like;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  /**
   * This function is used to get Like
   * @Param likeId:number
   * returns string
   */
  async deleteLike(likeId: number): Promise<string> {
    try {
      const Like: ILike = await this.LikeRep.findOneBy({
        id: likeId,
      });
      if (!Like) throw new Error('No Like by this ID!');
      await this.LikeRep.delete({ id: likeId });
      return 'deleted';
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
}
