import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { CreateConversationDTO, UpdateConversationDTO } from './dtos';
import { IConversation } from './interfaces/conversation.interface.dto';

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
}
