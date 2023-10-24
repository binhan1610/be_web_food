import { Food } from 'src/modules/food/entity/food.entity';
import { Voucher } from 'src/modules/vourcher/entity/vourcher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestaurantOwner } from './restaurantOwner.entity';

@Entity({ name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'restaurantName', unique: true })
  restaurantName: string;
  @Column({ name: 'address', nullable: true })
  address: string;
  @Column({ name: 'typeOfFood', nullable: true })
  typeOfFood: string;
  @OneToMany(() => Food, (foods) => foods.restaurant, { cascade: ['remove'] })
  listFood: Food[];
  @OneToOne(
    () => RestaurantOwner,
    (restaurantOwner) => restaurantOwner.restaurant,
  )
  @JoinColumn({ name: 'idOwner' })
  owner: RestaurantOwner;
  @OneToMany(() => Voucher, (voucher) => voucher.restaurant, {
    cascade: ['remove'],
  })
  listVoucher: Voucher[];
}
