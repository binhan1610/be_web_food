import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entity/vourcher.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { VoucherService } from './voucher.service';
import { VourcherController } from './voucher.controller';
import { Restaurant } from '../restaurant/entity/restarant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, Restaurant]), RestaurantModule],
  exports: [VoucherService],
  providers: [VoucherService],
  controllers: [VourcherController],
})
export class VoucherMoudle {}
