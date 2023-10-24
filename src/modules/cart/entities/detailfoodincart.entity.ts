import { Food } from 'src/modules/food/entity/food.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity({ name: 'detailfoods' })
export class DetailFoodInCart {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'amount' })
  amount: number;
  @Column({ name: 'total', nullable: true })
  total: number;
  @ManyToOne(() => Food, (food) => food.detailFoodInCart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'foodId' })
  foodInCart: Food;
  @ManyToOne(() => Cart, (cart) => cart.detailFood)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;
}
