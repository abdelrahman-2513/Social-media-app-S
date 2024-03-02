import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UpdateUserDTO } from './dtos';
import { IUser } from './interfaces';

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
      if (!user) return 'No user found by this id';
      const friends: number[] = user.friends.filter(
        (friend) => friend !== friendId,
      );
      const updatedUser: IUser = Object.assign(user, { friends });
      await this.userRep.save(updatedUser);
      return 'Removed successfully!';
    } catch (err) {
      console.log(err);
      throw new Error('Cannot Add friend');
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