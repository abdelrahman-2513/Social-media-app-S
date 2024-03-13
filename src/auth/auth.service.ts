import {
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthedUser } from './types';
import { Response, Request } from 'express';

import { ATPayload } from './payloads/AT.payload';
import { IUser } from '../user/interfaces/user.interface';
import { SignupDTO } from './dtos/register.dto';
import { UpdateUserDTO } from 'src/user/dtos';
import { UpdatePasswordDTO } from './dtos/password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userSVC: UserService,
    private JwtSVC: JwtService,
  ) {}

  // User sign in function
  public async signIn(
    email: string,
    enterdPassword: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userSVC.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const validUser = await this.verifyHash(enterdPassword, user.password);
      if (!validUser) {
        throw new UnauthorizedException('wrong email or password');
      }
      const ATtoken = this.generateAccessToken(user);
      const RTtoken = this.generateRefreshToken(user);
      const authedUser: AuthedUser = new AuthedUser(user, ATtoken, RTtoken);
      console.log(authedUser);
      console.log('from signin');

      res
        .cookie('AT', ATtoken, { httpOnly: true })
        .cookie('RT', RTtoken, { httpOnly: true })
        .status(200)
        .send(authedUser);
      //   return authedUser;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  public async signUp(newUSer: SignupDTO, @Res() res: Response) {
    try {
      const user = await this.userSVC.findUserByEmail(newUSer.email);
      if (user) {
        throw new UnauthorizedException('Email already exsist');
      }
      console.log(newUSer);
      const createdUser = await this.userSVC.createUser(newUSer);
      console.log('from signUp');
      res.status(201).send(createdUser);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async UpdateMe(userData: UpdateUserDTO, req: Request) {
    try {
      const { email } = req['user'];
      const user = await this.userSVC.findUserByEmail(email);

      if (!user) throw new UnauthorizedException('No user by this email!');
      const updatedUser: IUser = await this.userSVC.updateUserByEmail(
        email,
        userData,
      );

      return updatedUser;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot update user!');
    }
  }

  async UpdateMyPassword(passwordData: UpdatePasswordDTO, req: Request) {
    try {
      const { email } = req['user'];
      const user = await this.userSVC.findUserByEmail(email);

      if (!user) throw new UnauthorizedException('No user by this email!');
      if (passwordData.newPassword !== passwordData.confirmPassword)
        throw new Error('Passwords Not matched');
      const verified = await this.verifyHash(
        passwordData.currentPassword,
        user.password,
      );

      if (!verified) throw new UnauthorizedException('Wrong password!');

      const updatedUser = await this.userSVC.updatePasswordByEmail(
        passwordData.newPassword,
        email,
      );

      return updatedUser;
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  }

  private async refreshToken(refreshtoken: string, @Res() res: Response) {
    try {
      const decodedToken = await this.JwtSVC.verify(refreshtoken);
      const { email } = decodedToken;

      const user = await this.userSVC.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const ATtoken = this.generateAccessToken(user);

      const authedUser: AuthedUser = new AuthedUser(
        user,
        ATtoken,
        refreshtoken,
      );
      console.log(authedUser);
      console.log('from signin');

      res
        .cookie('AT', ATtoken, { httpOnly: true })
        .cookie('RT', refreshtoken, { httpOnly: true })
        .status(200)
        .send(authedUser);
      //   return authedUser;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  // Generate access token
  private generateAccessToken(user: IUser): string {
    const ATPayload: ATPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.JwtSVC.sign(ATPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '5h',
    });

    return token;
  }
  // Generate refresh token
  private generateRefreshToken(user: IUser): string {
    const ATPayload: ATPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.JwtSVC.sign(ATPayload, {
      secret: process.env.JWT_SECRET,

      expiresIn: '7d',
    });

    return token;
  }
  // verify the hashed password
  private async verifyHash(
    userPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, hashedPassword);
  }
}
