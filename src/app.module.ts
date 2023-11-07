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
import { BillModule } from './modules/bill/bill.module';
import { VoucherMoudle } from './modules/vourcher/voucher.module';
import { HistoryOrderModule } from './modules/historyorder/historyorder.module';
import * as admin from 'firebase-admin';
import { STORAGE_BUCKET_URL } from './configs/config';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CartModule,
    AuthenticationModule,
    RestaurantModule,
    FoodModule,
    NotificationModule,
    BillModule,
    VoucherMoudle,
    HistoryOrderModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
