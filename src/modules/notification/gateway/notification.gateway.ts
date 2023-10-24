import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateWay
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private users: string[] = [];

  handleConnection(client: Socket) {
    // Khi có kết nối mới, gửi danh sách người dùng hiện tại đến client
    client.emit('users', this.users);
  }

  handleDisconnect(client: Socket) {
    // Khi kết nối bị đóng, xóa người dùng khỏi danh sách
    const index = this.users.indexOf(client.id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    // Gửi danh sách người dùng mới đến tất cả clients
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, username: string) {
    // Xử lý khi người dùng tham gia phòng chat
    client['username'] = username;
    this.users.push(username);
    // Gửi danh sách người dùng mới đến tất cả clients
    this.server.emit('users', this.users);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    // Xử lý khi người dùng gửi tin nhắn
    // Sau đó, bạn gửi lại tin nhắn đó cho tất cả người dùng trong phòng
    const username = client['username'];
    this.server.emit('message', { username, message });
  }
  @SubscribeMessage('notification')
  handleNotification(@MessageBody() message: string) {
    this.server.emit('notification', message);
  }
}
