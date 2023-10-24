import { Cart } from 'src/modules/cart/entities/cart.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'bills' })
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'createdDate' })
  createdDate: string;
  @Column({ name: 'paidDate' })
  paidDate: string;
  @Column({ name: 'status' })
  status: string;
  @Column({ name: 'totalAmount' })
  totalAmount: number;
  @OneToOne(() => Cart, (cart) => cart.billOfCart)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;
  @ManyToOne(() => User, (user) => user.billOfUser)
  @JoinColumn({ name: 'userId' })
  author: User;
}
