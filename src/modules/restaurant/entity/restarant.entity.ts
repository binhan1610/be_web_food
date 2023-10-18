import { Food } from 'src/modules/food/entity/food.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'restaurantName', unique: true })
  restaurantName: string;

  @OneToMany(() => Food, (foods) => foods.restaurant)
  listFood: Food[];
  @Column({ name: 'owner' })
  owner: string;
}
