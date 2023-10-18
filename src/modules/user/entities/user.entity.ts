import { Cart } from 'src/modules/cart/entities/cart.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, name: 'username' })
  username: string;
  @Column({ name: 'password', select: false })
  password: string;
  @Column({ name: 'refreshToken', nullable: true, select: false })
  refreshToken: string;
  @OneToOne(() => Cart, (cart) => cart.author)
  cart: Cart;
  @Column({ name: 'roles', type: 'text', array: true, nullable: true })
  roles: string[];
}
