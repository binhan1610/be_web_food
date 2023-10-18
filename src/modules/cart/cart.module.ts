import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { FoodModule } from '../food/food.module';
import { UserModule } from '../user/user.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DetailFoodInCart } from './entities/detailfoodincart.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, DetailFoodInCart]),
    FoodModule,
    UserModule,
  ],
  exports: [CartService],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
