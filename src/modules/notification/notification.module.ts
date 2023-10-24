import { NotificationController } from './notifcation.controller';
import { Module } from '@nestjs/common';
import { NotificationGateWay } from './gateway/notification.gateway';

@Module({
  providers: [NotificationGateWay],
  controllers: [NotificationController],
})
export class NotificationModule {}
