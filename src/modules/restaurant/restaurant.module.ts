import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entity/restarant.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantOwner } from './entity/restaurantOwner.entity';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant, RestaurantOwner]),
    FirebaseModule,
  ],
  exports: [RestaurantService],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
