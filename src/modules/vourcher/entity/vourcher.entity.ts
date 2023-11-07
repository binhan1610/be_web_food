import { Payment } from 'src/modules/payment/entity/payment.entity';
import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'vouchers' })
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'discount_amount' })
  discountAmount: number;

  @Column({ name: 'min_order_amount' })
  minOrderAmount: number;
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  author: User;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.listVoucher)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
  @OneToOne(() => Payment, (payment) => payment.voucher)
  payment: Payment;
}
