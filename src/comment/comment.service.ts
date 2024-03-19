import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO, UpdateCommentDTO } from './dtos';
import { Request } from 'express';
import { IComment } from './interfaces/comment.interface';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
    constructor(@InjectRepository(Comment) private readonly commentRep: Repository<Comment>) { }
    
    /**
     * This function is used to create a comment
     * @Param commentData:CreateCommentDTO
     * @Param req:Request
     * returns Comment
     */
    async createComment(commentData: CreateCommentDTO, req: Request): Promise<IComment>{
        try {
            const newComment = new Comment()
            newComment.content = commentData.content;
            newComment.post = commentData.postId as unknown as Post;
            newComment.user = req["user"].id as unknown as User;

            return await this.commentRep.save(newComment);
        } catch (err) {
            console.log(err)
            throw new Error("Cannot create comment!");
        }
    }

    /**
     * This function is used to get comment
     * @Param commId:number
     * returns comment
    */
   async getComment(commentId: number): Promise<IComment>{
       try {
           const comment: IComment = await this.commentRep.findOneBy({ id: commentId });
           if(!comment) throw new Error("No comment by this ID!")
           return comment
        } catch (err) {
            console.log(err)
            throw new Error(err.message)
        }
    }
    /**
     * This function is used to update comment
     * @Param commId:number
     * @param commentData:UpdateCommentDTO
     * returns comment
     */
    async updateComment(commentId: number,commentData:UpdateCommentDTO): Promise<IComment>{
        try {
            const comment: IComment = await this.commentRep.findOneBy({ id: commentId });
            if (!comment) throw new Error("No comment by this ID!")
            comment.content = commentData.content
            return await this.commentRep.save(comment)
        } catch (err) {
            console.log(err)
            throw new Error(err.message)
        }
    }
    /**
     * This function is used to get comment
     * @Param commId:number
     * returns string
     */
    async deleteComment(commentId: number): Promise<string>{
        try {
            const comment: IComment = await this.commentRep.findOneBy({ id: commentId });
            if (!comment) throw new Error("No comment by this ID!")
            await this.commentRep.delete({id:commentId})
            return "deleted"
        } catch (err) {
            console.log(err)
            throw new Error(err.message)
        }
    }
}
