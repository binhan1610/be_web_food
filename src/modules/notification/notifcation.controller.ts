import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationGateWay } from './gateway/notification.gateway';
import { notifcation } from './interface/notification.interface';

@Controller('notification')
export class NotificationController {
  constructor(private readonly socketGateway: NotificationGateWay) {}

  @Post()
  sendNotification(@Body() message: notifcation) {
    this.socketGateway.handleNotification(message.message);
    return { message };
  }
}
