import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDTO } from './dtos/create.post.dto';
import { Request } from 'express';
import { IPost } from './interfaces/post.interface';
import { User } from 'src/user/entities/user.entity';
import { UpdatePostDTO } from './dtos/update.post.dto';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/interfaces';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRep: Repository<Post>,
    private readonly userSVC: UserService,
  ) {}

  /**
   * This function is used to create a post by the User
   * @Param postData:createPostDTO
   * @Param req:Request(express)
   * return newPost
   */
  async createPost(postData: CreatePostDTO, req: Request): Promise<IPost> {
    try {
      const newPost = new Post();
      newPost.content = postData.content;
      newPost.user = req['user'].id as unknown as User;
      newPost.userId = req['user'].id;
      await this.postRep.save(newPost);

      return await this.postRep
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .select(['post', 'user.name', 'user.image'])
        .where('post.content =:content', { content: postData.content })
        .orderBy('post.created_at', 'DESC')
        .getOne();
    } catch (err) {
      console.log(err);
      throw new Error('Cannot create Post!');
    }
  }

  /**
   * This function is used to update Post
   * @Param postId:number
   * @Param postData:UpdatePostDto
   * return updated post
   */
  async updatePost(postId: number, postData: UpdatePostDTO): Promise<IPost> {
    try {
      const post = await this.postRep.findOneBy({ id: postId });
      if (!post) throw new Error('No post found!');
      post.content = postData.content;

      await this.postRep.save(post);
      return await this.postRep
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.user', 'user')
        .select(['post', 'user.name', 'user.image'])
        .where('post.id = :postId ', { postId })
        .getOne();
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  /**
   * this function is used to get all Posts
   * @returns all posts
   */

  async getAllPosts(): Promise<IPost[]> {
    try {
      return await this.postRep.find({});
    } catch (err) {
      console.log(err);
      throw new Error('Cannot get all posts!');
    }
  }

  /**
   * Thisb function is used to get avilable posts for user
   * @param req:Request(express)
   * returns avilable 20 posts allowed for this user
   */
  async getUserFeeds(
    req: Request,
    page: number,
    pageSize: number = 20,
  ): Promise<IPost[]> {
    try {
      const user: IUser = await this.userSVC.findUserById(req['user'].id);
      const friends: number[] = user.friends;
      friends.push(req['user'].id);
      const offset = (page - 1) * pageSize;
      const feeds: IPost[] = await this.postRep
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .select(['post', 'user.name', 'user.image'])
        .where('post.userId IN (:...friends)', { friends })
        .orderBy('post.created_at', 'DESC')
        .offset(offset)
        .limit(pageSize)
        .getMany();
      return feeds;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot get User Feeds!');
    }
  }

  /**
   * This function is used to get all user Posts
   * @Param userId:number;
   * @returns userPosts
   */
  async getUserPosts(userId: number): Promise<IPost[]> {
    try {
      const userPosts: IPost[] = await this.postRep
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.user', 'user')
        .select(['post', 'user.name', 'user.image'])
        .where('user.id = :userId ', { userId })
        .getMany();
      return userPosts;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot get user posts now!');
    }
  }

  /**
   * This function is used to delete a post
   * @Param postId:number
   * @returns string
   */
  async deletePost(postId: number): Promise<string> {
    try {
      const post: IPost = await this.postRep.findOneBy({ id: postId });
      if (!post) throw new Error('No post founded!');
      await this.postRep.delete({ id: postId });
      return 'Deleted!';
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
}
