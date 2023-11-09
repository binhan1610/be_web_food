import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/data.module';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { CartModule } from './modules/cart/cart.module';
import { FoodModule } from './modules/food/food.module';
import { NotificationModule } from './modules/notification/notification.module';
import { VoucherMoudle } from './modules/vourcher/voucher.module';
import { HistoryOrderModule } from './modules/historyorder/historyorder.module';
import { FirebaseModule } from './firebase/firebase.module';

import { CommentModule } from './modules/comment/comment.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CartModule,
    AuthenticationModule,
    RestaurantModule,
    FoodModule,
    NotificationModule,
    VoucherMoudle,
    HistoryOrderModule,
    CommentModule,
    PaymentModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
