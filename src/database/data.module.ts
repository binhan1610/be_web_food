import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from '../configs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Food } from 'src/modules/food/entity/food.entity';
import { DetailFoodInCart } from 'src/modules/cart/entities/detailfoodincart.entity';
import { UserVip } from 'src/modules/user/entities/vipuser.entity';
import { Voucher } from 'src/modules/vourcher/entity/vourcher.entity';
import { Bill } from 'src/modules/bill/entity/bill.entity';
import { RestaurantOwner } from 'src/modules/restaurant/entity/restaurantOwner.entity';
import { UserInRestaurant } from 'src/modules/notification/entity/listuserinroom.entity';
import { HistoryOrder } from 'src/modules/historyorder/entity/historyorder.entity';
import { Payment } from 'src/modules/payment/entity/payment.entity';
import { Comment } from 'src/modules/comment/entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      database: config.DATABASE,
      entities: [
        User,
        Restaurant,
        Cart,
        Food,
        DetailFoodInCart,
        UserVip,
        Voucher,
        Bill,
        RestaurantOwner,
        UserInRestaurant,
        HistoryOrder,
        Payment,
        Comment,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
