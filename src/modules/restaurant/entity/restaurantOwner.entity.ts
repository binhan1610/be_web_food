import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restarant.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'restaurantOwner' })
export class RestaurantOwner {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Restaurant, (restaurant) => restaurant.owner, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
  @OneToOne(() => User, (user) => user.owner)
  @JoinColumn({ name: 'userId' })
  author: User;
}
