import { Food } from 'src/modules/food/entity/food.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { DetailFoodInCart } from './detailfoodincart.entity';

import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import { HistoryOrder } from 'src/modules/historyorder/entity/historyorder.entity';
import { Payment } from 'src/modules/payment/entity/payment.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total', default: 0 })
  total: number;
  @Column({ name: 'status', nullable: true })
  status: string;
  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'userId' })
  author: User;
  @OneToMany(
    () => DetailFoodInCart,
    (detailFoodInCart) => detailFoodInCart.cart,
    { eager: true, onDelete: 'CASCADE' },
  )
  detailFood: DetailFoodInCart[];
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.listOrder)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
  @OneToMany(() => Payment, (payment) => payment.cart)
  payment: Payment[];
}
