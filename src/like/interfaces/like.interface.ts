import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";

export interface ILike{
    id?: number;
    user?: User;
    post?: Post;
}