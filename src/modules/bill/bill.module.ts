import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entity/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
})
export class BillModule {}
