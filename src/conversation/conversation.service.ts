import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreateConversationDTO, UpdateConversationDTO } from './dtos';
import { IConversation } from './interfaces/conversation.interface.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
  ) {}

  /**
   * This function is used to create a new conversation
   * @Param conversaation name: string
   * returns newConversation: IConversation
   */
  async createConversation(
    convers: CreateConversationDTO,
  ): Promise<IConversation> {
    try {
      const newConversation: Conversation = new Conversation();
      newConversation.name = convers.name;
      newConversation.type = convers.type;
      newConversation.participants = convers.participantsId.map(
        (id) => ({ id }) as User,
      );
      return await this.conversationRepo.save(newConversation);
    } catch (err) {
      console.log(err);
      throw new Error('Cannot create conversation now!');
    }
  }
  /**
   * This function is used to update the conversation
   * @Param id:string
   * @param updated:UPdateConversationDTO
   * returns the updated conversation
   */
  async updateConversation(
    id: number,
    updatedCon: UpdateConversationDTO,
  ): Promise<IConversation> {
    try {
      const conv: IConversation = await this.conversationRepo.findOneBy({ id });
      if (!conv) throw new Error('This conversation is not found!');
      const updatedConv = Object.assign(conv, updatedCon);
      return await this.conversationRepo.save(updatedCon);
    } catch (err) {
      console.log(err);
      throw new Error('Cannot update Conversation !');
    }
  }

  /**
   * This function is used to find the conversation
   * @Param name:string
   * returns the founded conversation
   */
  async findConversationByName(name: string): Promise<IConversation> {
    try {
      const conv = await this.conversationRepo.findOneBy({ name });
      if (!conv) throw new Error('Not Found');
      return conv;
    } catch (err) {
      console.log(err);
      throw new Error('No conversation found By this name!');
    }
  }
  /**
   * This function is used to find the conversation
   * @Param id:number
   * returns the founded conversation
   */
  async findConversationById(id: number): Promise<IConversation> {
    try {
      const conv = await this.conversationRepo.findOneBy({ id });
      if (!conv) throw new Error('Not Found');
      return conv;
    } catch (err) {
      console.log(err);
      throw new Error('No conversation found By this id!');
    }
  }
  /**
   * This function is used to find all conversations
   * returns the founded conversationa
   */
  async findAllConversations(): Promise<IConversation[]> {
    try {
      const conv = await this.conversationRepo.find();

      return conv;
    } catch (err) {
      console.log(err);
      throw new Error('No conversation found By this id!');
    }
  }
  /**
   * This function is used to delete Conversation
   * @Param name:string
   * returns NULL
   */
  async deleteConversation(name: string) {
    try {
      const founded = await this.conversationRepo.findOneBy({ name });
      if (!founded) throw new Error('No conversations founded!');
      return await this.conversationRepo.delete({ name });
    } catch (err) {
      console.log(err);
      throw new Error('No conversations to be deleted!');
    }
  }
  /**
   * This function is used to find user conversations
   * @Param userId:number
   * returns userConversations:Iconversation
   */
  async getUserConversations(userId: number): Promise<IConversation[]> {
    try {
      const userConversations: IConversation[] = await this.conversationRepo
        .createQueryBuilder('conversation')
        .innerJoin('conversation.participants', 'user')
        .leftJoinAndSelect('conversation.participants', 'users')
        .where('user.id = :userId AND users.id != :userId', { userId })
        .select(['conversation', 'users.name', 'users.image', 'users.id'])
        .getMany();
      return userConversations;
    } catch (err) {
      console.log(err);
      throw new Error('Connot get conversations now!');
    }
  }

  /**
   * This function is used to add user to a conversation
   * @Param conversationId:number
   * @Param updateConv:UpdateConversationDTO
   * returns added
   */
  async addUserToConversation(
    conversationId: number,
    updateConv: UpdateConversationDTO,
  ): Promise<string> {
    try {
      const foundConversation: IConversation =
        await this.conversationRepo.findOneBy({ id: conversationId });
      if (!foundConversation) return 'No conversation by this id';
      const newUser: User[] = updateConv.participantsId.map(
        (id) => ({ id }) as User,
      );
      foundConversation.participants = [
        ...foundConversation.participants,
        ...newUser,
      ];
      await this.conversationRepo.save(foundConversation);
      return 'Added';
    } catch (err) {
      console.log(err);
      throw new Error('Cannot add user to this conversation');
    }
  }

  /**
   * This function is used to remove a user from the conversation
   * @Param conversationId:number
   * @Param userId:number
   * return string
   */
  async removeUserFromConversation(
    convId: number,
    userId: number,
  ): Promise<string> {
    try {
      const foundedConversation: IConversation =
        await this.conversationRepo.findOneBy({ id: convId });
      if (!foundedConversation) return 'No conversation Found!';
      const userIndex: number = foundedConversation.participants.findIndex(
        (participant) => participant.id == userId,
      );

      if (userIndex == -1) return 'User isnot in this conversation';
      foundedConversation.participants.splice(userIndex, 1);
      await this.conversationRepo.save(foundedConversation);
      return 'Removed!';
    } catch (err) {
      console.log(err);
      throw new Error('Cannot Remove User now!');
    }
  }
}
