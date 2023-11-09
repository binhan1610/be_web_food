import { HistoryOrderController } from './historyorder.controller';
import { HistoryOrderService } from './historyorder.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryOrder } from './entity/historyorder.entity';
@Module({
  imports: [TypeOrmModule.forFeature([HistoryOrder])],
  exports: [HistoryOrderService],
  providers: [HistoryOrderService],
  controllers: [HistoryOrderController],
})
export class HistoryOrderModule {}
