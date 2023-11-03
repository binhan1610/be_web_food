import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as http from 'http';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Thay đổi thành origin của ứng dụng React của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Nếu bạn cần hỗ trợ gửi cookie
  });

  await app.listen(3001);
}
bootstrap();
