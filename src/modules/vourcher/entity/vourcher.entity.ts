import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.vouchers)
  restaurant: Restaurant;
}
