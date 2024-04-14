import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UpdateUserDTO } from './dtos';
import { IUser } from './interfaces';
import { Request } from 'express';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRep: Repository<User>,
  ) {}

  /**
   * this function is used to create an user
   * @Param createUserDTO instance where we initialized the rules for creating UserService
   * return promise of created user
   * */

  async createUser(createUserDTO: CreateUserDTO): Promise<IUser> {
    try {
      const newUser: User = new User();
      newUser.name = createUserDTO.name;
      newUser.email = createUserDTO.email;
      newUser.age = createUserDTO.age;
      newUser.friends = [];
      newUser.role = createUserDTO.role;
      newUser.gender = createUserDTO.gender;
      newUser.password = await this.hashPassword(createUserDTO.password);
      newUser.posts = [];
      if (createUserDTO.image) newUser.image = createUserDTO.image;

      return this.userRep.save(newUser);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create user Try again later!');
    }
  }
  /**
   * this function is used for login by email and password
   * @Param emial string for user to check
   * returns user data
   */

  async findUserByEmail(email: string): Promise<IUser> {
    console.log(email);
    try {
      return await this.userRep.findOneBy({ email });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to find user by this email!');
    }
  }

  /**
   * This function is used to update user by the email
   * @param useremail:string
   * @param userData: updateUserDTO
   * returns new user with status code 304
   */

  async updateUserByEmail(
    email: string,
    userData: UpdateUserDTO,
  ): Promise<IUser> {
    try {
      const foundUser: IUser = await this.userRep.findOneBy({ email });
      if (!foundUser) throw new Error('No user found by this email!');
      const updatedUser = Object.assign(foundUser, userData);

      return this.userRep.save(updatedUser);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update user!');
    }
  }

  /**
   * This function is used to read all the entitties in the user database
   * returns users
   */
  async findUsers(): Promise<IUser[]> {
    try {
      const users = await this.userRep.find();
      return users;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot Find users now!');
    }
  }
  /**
   * This function is used to find user by id
   * @param userId:number
   * returns users
   */
  async findUserById(userId: number): Promise<IUser> {
    try {
      const user = await this.userRep
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.posts', 'post') // Left join to load posts
        .where('user.id = :userId', { userId })
        .getOne();
      return user;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot Find users now!');
    }
  }

  /**
   * This function is used to delete a user using the email
   * @Param email:string
   * return emptyfield
   */
  async deleteUser(email: string) {
    try {
      const foundUser = await this.userRep.findOneBy({ email });
      if (!foundUser) throw new Error('No user found by this email!');
      return await this.userRep.delete({ email });
    } catch (err) {
      console.log(err);
      throw new Error('Cannot delete user!');
    }
  }
  /**
   * this function is used to add friend
   * @Param userId:number
   * @param friendId:number
   * returns used data
   */
  async addFriend(userId: number, friendId: number): Promise<boolean> {
    try {
      const user: IUser = await this.userRep.findOneBy({ id: userId });
      const friend: IUser = await this.userRep.findOneBy({ id: friendId });
      if (!user || !friend) return false;

      const updatedUser: IUser = Object.assign(user, {
        friends: Array.isArray(user.friends)
          ? [...user.friends, friendId]
          : [friendId],
      });

      const updatedFriend: IUser = Object.assign(friend, {
        friends: Array.isArray(friend.friends)
          ? [...friend.friends, userId]
          : [userId],
      });

      await this.userRep.save(updatedUser);
      await this.userRep.save(updatedFriend);
      return true;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot Add friend');
    }
  }
  /**
   * this function is used to remove friend
   * @Param userId:number
   * @param friendId:number
   * returns used data
   */
  async removeFriend(userId: number, friendId: number): Promise<string> {
    try {
      const user: IUser = await this.userRep.findOneBy({ id: userId });
      const friend: IUser = await this.userRep.findOneBy({ id: friendId });
      if (!user || !friend) return 'No user found by this id';

      const userFriends: number[] = user.friends.filter(
        (friend) => Number(friend) !== Number(friendId),
      );
      const friendFriends: number[] = friend.friends.filter(
        (friend) => Number(friend) !== Number(userId),
      );
      const updatedUser: IUser = Object.assign(user, { friends: userFriends });
      const updatedFriend: IUser = Object.assign(friend, {
        friends: friendFriends,
      });
      await this.userRep.save(updatedUser);
      await this.userRep.save(updatedFriend);

      return 'Removed successfully!';
    } catch (err) {
      console.log(err);
      throw new Error('Cannot Add friend');
    }
  }

  /**
   * This function is used to update user Password
   * @Param newPassword:string
   * return updatedUser
   */
  async updatePasswordByEmail(
    newPAssword: string,
    email: string,
  ): Promise<IUser> {
    try {
      const user = await this.userRep.findOneBy({ email: email });
      if (!user) throw new Error('User not found');
      const hashedPassword = await this.hashPassword(newPAssword);
      const updatedUser: IUser = Object.assign(user, {
        password: hashedPassword,
      });
      return await this.userRep.save(updatedUser);
    } catch (err) {
      console.log(err);
      throw new Error('Cannot update password!');
    }
  }

  /**
   * This funciton is used to search for users
   * @Param searchQuery:string
   * returns avilable user depending on this query
   */

  async searchUsersByName(searchQuery: string, req: Request): Promise<IUser[]> {
    try {
      const users: IUser[] = await this.userRep
        .createQueryBuilder('user')
        .where('user.name ILIKE :name AND user.id <> :id', {
          name: `%${searchQuery}%`,
          id: req['user'].id,
        })
        .getMany();
      return users;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot update password!');
    }
  }

  /**
   * This function is used to get the user Friends
   * @param userId:number
   * returns User[]
   */
  async getUserFriends(userID: number): Promise<IUser[]> {
    try {
      const user: IUser = await this.userRep.findOneBy({ id: userID });
      if (!user) throw new Error('no user bu this Id!');
      const friends: IUser[] = await this.userRep.find({
        where: {
          id: In(user.friends || []),
        },
        select: ['id', 'name', 'image'],
      });
      return friends;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  /**
   * This function is used to hashing the password of the user
   * @Param password that the user enterd
   * returns the hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }
}
