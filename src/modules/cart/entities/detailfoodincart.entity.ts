import { Food } from 'src/modules/food/entity/food.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity({ name: 'detailfoods' })
export class DetailFoodInCart {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'amount' })
  amount: number;
  @ManyToOne(() => Food, (food) => food.detailFoodInCart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'foodId' })
  foodInCart: Food;
  @ManyToOne(() => Cart, (cart) => cart.detailFood)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;
}
