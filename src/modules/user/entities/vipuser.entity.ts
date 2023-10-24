import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'uservips' })
export class UserVip {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'isVip', nullable: true })
  isVip: boolean;
  @Column({ name: 'registrationDate', type: 'timestamp', nullable: true }) // 'registrationDate' là tên cột ngày đăng ký
  registrationDate: String;

  @Column({ name: 'expirationDate', type: 'timestamp', nullable: true }) // 'expirationDate' là tên cột ngày hết hạn
  expirationDate: String;
  @OneToOne(() => User, (user) => user.userVip)
  @JoinColumn({ name: 'userId' })
  author: User;
}
