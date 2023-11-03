import { Body, Controller, Get, Post } from '@nestjs/common';

import { notifcation } from './interface/notification.interface';

@Controller('notification')
export class NotificationController {
  constructor() {}
}
