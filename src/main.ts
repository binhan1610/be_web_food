import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Thay đổi thành tên miền của trang web của bạn hoặc '*' để cho phép từ tất cả các nguồn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Đặt thành true nếu bạn muốn sử dụng cookies hoặc xác thực dựa trên cookie
  });

  await app.listen(3000);
}
bootstrap();
