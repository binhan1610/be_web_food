import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entity/restarant.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  exports: [RestaurantService],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
