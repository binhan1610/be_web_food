import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserInRestaurant } from '../entity/listuserinroom.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    @InjectRepository(UserInRestaurant)
    private readonly uirRepository: Repository<UserInRestaurant>,
  ) {}
  @WebSocketServer() server: Server;
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    client: Socket,
    payload: { userId?: string; restaurantId: string },
  ) {
    if (!payload.userId) {
      const room = `${payload.restaurantId}`;
      client.join(room);
      console.log(`Client joined room: ${room}`);
    } else {
      const room = `${payload.restaurantId}-${payload.userId}`;
      client.to(`${payload.restaurantId}`).emit('newCustomerJoin', payload);
      client.join(room);
      console.log(`Client joined room: ${room}`);
    }
  }

  @SubscribeMessage('sendPrivateMessage')
  handleSendPrivateMessage(
    client: Socket,
    data: {
      senderId: string;
      receiverId: string;
      newMessage: {
        message: string;
        position: string;
      };
      room: string;
    },
  ) {
    console.log(data.newMessage);

    const room = `${data.senderId}-${data.receiverId}`; // Tạo tên phòng chat dựa trên thông tin người gửi và người nhận
    client.to(data.room).emit('privateMessage', data.newMessage);
  }

  @SubscribeMessage('leaveRestaurantRoom')
  async handerleaveRestaurantRoom(client: Socket, userId: number) {
    await this.uirRepository.delete({ userId: userId });
  }
}
