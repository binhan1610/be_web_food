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
import { Bill } from 'src/modules/bill/entity/bill.entity';
import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total', default: 0 })
  total: number;
  @Column({ name: 'status' })
  status: string;
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'userId' })
  author: User;
  @OneToMany(
    () => DetailFoodInCart,
    (detailFoodInCart) => detailFoodInCart.cart,
    { onDelete: 'CASCADE', eager: true },
  )
  detailFood: DetailFoodInCart[];
  @OneToOne(() => Bill, (bill) => bill.cart)
  billOfCart: Bill;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.listOrder)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
}
