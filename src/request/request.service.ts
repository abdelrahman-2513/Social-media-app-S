import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { Repository } from 'typeorm';
import { CreateRequestDTO } from './dtos';
import { IRequest } from './interfaces/request.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RequestService {
  constructor(
    private readonly userSVC: UserService,
    @InjectRepository(Request) private requestRepostiry: Repository<Request>,
  ) {}

  /**
   * This function is used to create a new request
   * @Param newReq:CreateRequestDTO
   * return created Request
   */
  async createNewRequest(newReq: CreateRequestDTO): Promise<IRequest> {
    try {
      const newRequest: Request = new Request();
      newRequest.fromUserId = newReq.fromUserId;
      newRequest.toUserId = newReq.toUserId;
      return await this.requestRepostiry.save(newRequest);
    } catch (err) {
      console.log(err);
      throw new Error('Cannot create a request now');
    }
  }

  /**
   * This function is used to get user Requests
   * @Param userId:number
   * return user requests
   */
  async getUserRequests(
    userEmail: string,
  ): Promise<{ fromUser: IRequest[]; toUser: IRequest[] }> {
    try {
      const userRequestsFrom: IRequest[] = await this.requestRepostiry
        .createQueryBuilder('request')
        .innerJoinAndSelect('request.fromUser', 'fromUser')
        .leftJoinAndSelect('request.toUser', 'toUser')
        .select([
          'request',
          'fromUser.name',
          'fromUser.email',
          'fromUser.image',
          'toUser.email',
          'toUser.name',
        ])
        .where('fromUser.email = :userEmail', { userEmail })
        .getMany();

      const userRequestsTo: IRequest[] = await this.requestRepostiry
        .createQueryBuilder('request')
        .innerJoinAndSelect('request.fromUser', 'fromUser')
        .leftJoinAndSelect('request.toUser', 'toUser')
        .select([
          'request',
          'fromUser.name',
          'fromUser.email',
          'toUser.email',
          'toUser.name',
        ])
        .where('toUser.email = :userEmail', { userEmail })
        .getMany();

      return { fromUser: userRequestsFrom, toUser: userRequestsTo };
    } catch (err) {
      console.log(err);
      throw new Error('Cannot find user Requests!');
    }
  }

  /**
   * This function is used to get allusers Requests
   * return users requests
   */
  async getAllRequests(): Promise<IRequest[]> {
    try {
      const usersRequests: IRequest[] = await this.requestRepostiry.find();

      return usersRequests;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot find user Requests!');
    }
  }

  /**
   * This function is Used when a user want to accept a request
   * @Param requestId:number
   * returns acceptance message
   */
  async acceptRequest(requestId: number): Promise<string> {
    try {
      const request: IRequest = await this.requestRepostiry.findOneBy({
        id: requestId,
      });
      if (!request) return 'No request by this id!';

      const accepted = await this.userSVC.addFriend(
        request.fromUserId,
        request.toUserId,
      );
      if (accepted) {
        console.log(accepted);
        const updatedRequest: IRequest = Object.assign(request, {
          accepted: true,
        });
        await this.requestRepostiry.save(updatedRequest);
        return 'Added successfully!';
      }
      return 'Cannot add user now!';
    } catch (err) {
      console.log(err);
      throw new Error('Cannot add user now!');
    }
  }
  /**
   * This function is used to remove friend
   * @param usreId:number
   * @param frienId:number
   * return string
   */
  async removeFriend(userId: number, friendId: number): Promise<string> {
    try {
      const acceptedRequest: IRequest = await this.requestRepostiry
        .createQueryBuilder('request')
        .where(
          '(request.fromUserId = :userId OR request.toUserId = :userId) AND (request.fromUserId = :friendId OR request.toUserId = :friendId)',
          { userId, friendId },
        )
        .getOne();
      if (!acceptedRequest) return 'No accepted request by this data!';
      await this.userSVC.removeFriend(userId, friendId);
      await this.deleteRequest(acceptedRequest.id);
      return 'Removed';
    } catch (err) {
      console.log(err);
      throw new Error('Cannot remove friend now!');
    }
  }
  /**
   * This function is Used delete a request
   * @Param requestId:number
   * returns acceptance message
   */
  async deleteRequest(requestId: number) {
    console.log('from delete request');
    try {
      const request: IRequest = await this.requestRepostiry.findOneBy({
        id: requestId,
      });
      if (!request) return 'No request by this id!';

      await this.requestRepostiry.delete({ id: requestId });
      return 'Removed!';
    } catch (err) {
      console.log(err);
      throw new Error('Cannot delete request!');
    }
  }
}
