import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDTO, UpdateMessageDTO } from './dtos';
import { IMessage } from './interfaces/messagee.interfcae';
import { User } from 'src/user/entities/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRep: Repository<Message>,
  ) {}

  /**
   * This function is used to create message
   * @Param messageData:CreateMessageDTO
   * return messageSavedData:IMessage
   */
  async createMessage(messageData: CreateMessageDTO): Promise<IMessage> {
    try {
      const newMessage: Message = new Message();

      newMessage.content = messageData.content;
      newMessage.user = messageData.userId as unknown as User;
      newMessage.conversation = messageData.convId as unknown as Conversation;
      newMessage.conversationId = messageData.convId;

      return await this.messageRep.save(newMessage);
    } catch (err) {
      console.log(err);
      throw new Error('Cannot Create Message!');
    }
  }

  /**
   * This function is used to get all messages
   * return IMessages[]
   */
  async getAllMessages(): Promise<IMessage[]> {
    try {
      return await this.messageRep.find();
    } catch (err) {
      console.log(err);
      throw new Error('Cannot get messages!');
    }
  }

  /**
   * This function is used to get messages of conversaiton
   * @Param convId:number
   * return messageData:IMessage
   */
  async getConversationMessage(
    convId: number,
    page: number,
    pageSize: number,
  ): Promise<IMessage[]> {
    try {
      const offset = (page - 1) * pageSize;
      const messages: IMessage[] = await this.messageRep
        .createQueryBuilder('message')
        .innerJoinAndSelect('conversation', 'conv')
        .where('conv.id = :convId', { convId })
        .orderBy('message.created_at', 'DESC')
        .offset(offset)
        .limit(pageSize)
        .getMany();
      return messages;
    } catch (err) {
      console.log(err);
      throw new Error('Cannot get conversation messages!');
    }
  }

  /**
   * This function is used to update Message
   * @Param msgId:number
   * @Param msgContent:UpdateMessageDTO
   * return string
   */
  async updateMessage(msgId: number, msgContent: string): Promise<IMessage> {
    try {
      const message: IMessage = await this.messageRep.findOneBy({ id: msgId });
      if (!message) throw new Error('No message byt this Id');
      const updatedMessage: IMessage = Object.assign(message, {
        edited: true,
        content: msgContent,
      });
      await this.messageRep.save(updatedMessage);
      return updatedMessage;
    } catch (err) {
      console.log(err);
      throw new Error('Connot edit message by this id!');
    }
  }
  /**
   * This function is used to delete Message
   * @Param msgId:number
   * return string
   */
  async deleteMessage(msgId: number): Promise<IMessage> {
    try {
      const message: IMessage = await this.messageRep.findOneBy({
        id: msgId,
      });
      if (!message) throw new Error('No message byt this Id');
      const updtaedMessage: IMessage = Object.assign(message, {
        deleted: true,
      });
      await this.messageRep.save(updtaedMessage);
      return updtaedMessage;
    } catch (err) {
      console.log(err);
      throw new Error('Connot delete message by this id!');
    }
  }
  /**
   * This function is used to delete Conversation messages
   * @Param convId:number
   * return string
   */
  async deleteConvMessages(convId: number): Promise<string> {
    try {
      // const num =Number(convId)
      const result = await this.messageRep
        .createQueryBuilder('message')
        .where('message.conversationid = :convId', { convId: Number(convId) })
        .delete()
        .execute();

      if (
        result.affected !== null &&
        result.affected !== undefined &&
        result.affected > 0
      ) {
        return 'deleted';
      } else {
        throw new Error('No messages found for the given conversation ID.');
      }
    } catch (err) {
      console.log(err);
      throw new Error('Cannot delete messages for the given conversation ID!');
    }
  }
  async findNewestByConvId(
    convId: number,
    page,
    pageSize,
  ): Promise<IMessage[]> {
    const offset = (page - 1) * pageSize;
    return await this.messageRep
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user') // Eagerly load the 'user' relation
      .where('message.conversationid = :convId', { convId })
      .orderBy('message.id', 'DESC')
      .select(['message', 'user.name', 'user.image', 'user.id'])
      .offset(offset)
      .limit(pageSize)
      .getMany();
  }
}
