import { HistoryOrder } from 'src/modules/historyorder/entity/historyorder.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Voucher } from 'src/modules/vourcher/entity/vourcher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from 'src/modules/cart/entities/cart.entity';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'datepayment' })
  datepayment: string;
  @Column({ name: 'quantity' })
  quantity: number;
  @Column({ name: 'paymentmethods', nullable: true })
  paymentMethods: string;
  @Column({ name: 'status', nullable: true })
  status: string;
  @ManyToOne(() => User, (user) => user.listPayment)
  @JoinColumn({ name: 'idUser' })
  author: User;
  @ManyToOne(() => Voucher, (voucher) => voucher.payment)
  voucher: Voucher;
  @OneToOne(() => HistoryOrder, (history) => history.information)
  historyOrder: HistoryOrder;
  @ManyToOne(() => Cart, (cart) => cart.payment)
  cart: Cart;
}
