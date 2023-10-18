import { Food } from 'src/modules/food/entity/food.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DetailFoodInCart } from './detailfoodincart.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total', default: 0 })
  total: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'userId' })
  author: User;
  @OneToMany(
    () => DetailFoodInCart,
    (detailFoodInCart) => detailFoodInCart.cart,
  )
  detailFood: DetailFoodInCart[];
}
