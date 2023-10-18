import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entity/food.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Food]), RestaurantModule],
  exports: [FoodService],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
