// websocket.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message.service';
import { CreateMessageDTO } from '../dtos';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    client: Socket,
    conversationId: string,
  ): Promise<void> {
    // Join the conversation room
    client.join(conversationId);
    console.log(`${client} joined ${conversationId}`);
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(
    client: Socket,
    conversationId: string,
  ): Promise<void> {
    // Leave the conversation room
    client.leave(conversationId);
  }
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: string) {
    const msgData = JSON.parse(payload.toString());
    console.log(msgData);
    const message = await this.messageService.createMessage(msgData);
    this.server
      .to(message.conversationId.toString())
      .emit('newMessage', message);
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    client: Socket,
    payload: { id: number; content: string },
  ) {
    const message = await this.messageService.updateMessage(
      payload.id,
      payload.content,
    );
    this.server
      .to(message.conversationId.toString())
      .emit('editedMessage', message);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(client: Socket, messageId: number) {
    const message = await this.messageService.deleteMessage(messageId);
    this.server
      .to(message.conversationId.toString())
      .emit('deletedMessage', message);
  }
}
