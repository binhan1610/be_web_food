import { Cart } from 'src/modules/cart/entities/cart.entity';
import { DetailFoodInCart } from 'src/modules/cart/entities/detailfoodincart.entity';
import { Payment } from 'src/modules/payment/entity/payment.entity';
import { Voucher } from 'src/modules/vourcher/entity/vourcher.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'historyorder' })
export class HistoryOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Payment, (payment) => payment.historyOrder)
  information: Payment;
}
