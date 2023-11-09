import { JoinColumn } from 'typeorm';
import { Restaurant } from 'src/modules/restaurant/entity/restarant.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    name: 'rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  rate: number;
  @Column({ name: 'comment' })
  comment: string;
  @ManyToOne(() => User, (user) => user.listComment)
  @JoinColumn({ name: 'idUser' })
  author: User;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.listComment)
  @JoinColumn({ name: 'idRestaurant' })
  restaurant: Restaurant;
}
