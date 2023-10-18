import { Cart } from 'src/modules/cart/entities/cart.entity';
import { DetailFoodInCart } from 'src/modules/cart/entities/detailfoodincart.entity';
import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'food' })
export class Food {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'foodname' })
  foodName: string;
  @Column({ name: 'title' })
  title: string;
  @Column({ name: 'total' })
  total: number;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.listFood)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;
  @OneToOne(
    () => DetailFoodInCart,
    (detailFoodInCart) => detailFoodInCart.foodInCart,
  )
  detailFoodInCart: DetailFoodInCart;
}
