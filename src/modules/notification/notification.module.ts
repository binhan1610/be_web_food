import { NotificationController } from './notifcation.controller';
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInRestaurant } from './entity/listuserinroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInRestaurant])],
  providers: [ChatGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}
