import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET, JWT_SECRET_EXPIRED } from 'src/configs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    UserModule,
    RestaurantModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: JWT_SECRET,
        signOptions: {
          expiresIn: JWT_SECRET_EXPIRED,
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
