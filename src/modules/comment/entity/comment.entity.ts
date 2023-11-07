import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'rate' })
  rate: number;
  @Column({ name: 'comment' })
  comment: string;
  @ManyToOne(() => User, (user) => user.listComment)
  author: User;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.listComment)
  restaurant: Restaurant;
}
