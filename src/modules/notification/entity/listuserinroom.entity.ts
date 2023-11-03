import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_in_restaurnat' })
export class UserInRestaurant {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'userId' })
  userId: number;
  @Column({ name: 'restaurantId' })
  restaurantId: number;
}
