import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryOrder } from './entity/historyorder.entity';
@Module({
  imports: [TypeOrmModule.forFeature([HistoryOrder])],
})
export class HistoryOrderModule {}
