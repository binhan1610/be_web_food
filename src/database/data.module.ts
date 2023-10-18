import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from '../configs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Food } from 'src/modules/food/entity/food.entity';
import { DetailFoodInCart } from 'src/modules/cart/entities/detailfoodincart.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      database: config.DATABASE,
      entities: [User, Restaurant, Cart, Food, DetailFoodInCart],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}