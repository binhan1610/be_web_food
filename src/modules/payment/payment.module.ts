import { HistoryOrderModule } from './../historyorder/historyorder.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { CartModule } from '../cart/cart.module';
import { VoucherMoudle } from '../vourcher/voucher.module';
import { UserModule } from '../user/user.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    CartModule,
    VoucherMoudle,
    UserModule,
    HistoryOrderModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
