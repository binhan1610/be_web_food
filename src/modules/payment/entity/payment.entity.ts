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
  datapayment: Date;
  @Column({ name: 'quantity' })
  quantity: number;
  @Column({ name: 'paymentmethods' })
  paymentMethods: string;
  @ManyToOne(() => User, (user) => user.listPayment)
  @JoinColumn({ name: 'idUser' })
  author: User;
  @OneToOne(() => Voucher, (voucher) => voucher.payment)
  voucher: Voucher;
  @OneToOne(() => HistoryOrder, (history) => history.information)
  historyOrder: HistoryOrder;
  @OneToOne(() => Cart, (cart) => cart.payment)
  cart: Cart;
}
