import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Voucher } from 'src/modules/vourcher/entity/vourcher.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { UserVip } from './vipuser.entity';
import { Bill } from 'src/modules/bill/entity/bill.entity';
import { RestaurantOwner } from 'src/modules/restaurant/entity/restaurantOwner.entity';
import { Payment } from 'src/modules/payment/entity/payment.entity';
import { Comment } from 'src/modules/comment/entity/comment.entity';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, name: 'username' })
  username: string;
  @Column({ name: 'password', select: false })
  password: string;
  @Column({ name: 'phonenumber', nullable: true })
  phonenumber: string;
  @Column({ name: 'email', nullable: true })
  email: string;
  @Column({ name: 'refreshToken', nullable: true, select: false })
  refreshToken: string;
  @OneToOne(() => Cart, (cart) => cart.author, { onDelete: 'CASCADE' })
  cart: Cart;
  @Column({ name: 'roles', type: 'text', array: true, nullable: true })
  roles: string[];
  @OneToMany(() => Voucher, (voucher) => voucher.author, {
    onDelete: 'CASCADE',
  })
  listVoucher: Voucher[];
  @OneToOne(() => UserVip, (userVip) => userVip.author, {
    onDelete: 'CASCADE',
  })
  userVip: UserVip;
  @OneToMany(() => Bill, (bill) => bill.author)
  billOfUser: Bill[];
  @OneToOne(() => RestaurantOwner, (restaurantOwner) => restaurantOwner.author)
  owner: RestaurantOwner;
  @OneToMany(() => Payment, (payment) => payment.author)
  listPayment: Payment[];
  @OneToMany(() => Comment, (comment) => comment.author)
  listComment: Comment[];
}
