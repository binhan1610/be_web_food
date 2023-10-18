import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/data.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { CartModule } from './modules/cart/cart.module';
import { FoodModule } from './modules/food/food.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CartModule,
    AuthenticationModule,
    RestaurantModule,
    FoodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}