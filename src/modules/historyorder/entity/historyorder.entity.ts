import { DetailFoodInCart } from 'src/modules/cart/entities/detailfoodincart.entity';
import { Voucher } from 'src/modules/vourcher/entity/vourcher.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'historyorder' })
export class HistoryOrder {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => DetailFoodInCart, (detailFood) => detailFood)
  listFood: DetailFoodInCart[];
  @OneToMany(() => Voucher, (voucher) => voucher)
  listVoucher: Voucher[];
  @Column({ name: 'total' })
  total: number;
  @Column({ name: 'discount' })
  discount: number;
  @Column({ name: 'finnaltotal' })
  finnalTotal: number;
}
//để cột trạng thái cho giỏ hàng khi đã đặt hàng dùng giỏ hàng đã đặt
//để liên kết với historyOrder cho dễ
//khi tìm giỏ hàng thì tìm xem người dùng có giỏ hàng nào chưa thanh toán
