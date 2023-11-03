import { Injectable } from '@nestjs/common';
import { NewVoucher } from './dto/newVoucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from './entity/vourcher.entity';
import { Repository } from 'typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/entity/restarant.entity';
@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepositoy: Repository<Restaurant>,
  ) {}
  public async addVoucherRestaurant(
    idRestaurnat: number,
    newVoucher: NewVoucher,
  ) {
    const restaurant = await this.restaurantRepositoy.findOneBy({
      id: idRestaurnat,
    });
    // .createQueryBuilder('restaurants')
    // .where('restaurants.id=:id', { id: idRestaurnat })
    // .leftJoinAndSelect('restaurants.listVoucher', 'listVoucher')
    // .getOne();

    const voucher = new Voucher();
    voucher.title = newVoucher.title;
    voucher.discountAmount = newVoucher.discountAmount;
    voucher.minOrderAmount = newVoucher.minOrderAmount;
    voucher.restaurant = restaurant;
    try {
      this.voucherRepository.save(voucher);
      return voucher;
    } catch (error) {
      console.log(error);
    }
  }
  public async getAllVouCherByIdRestaurant(idRestaurant: number) {
    const listVoucher = await this.restaurantRepositoy
      .createQueryBuilder('restaurants')
      .leftJoinAndSelect('restaurants.listVoucher', 'listVoucher')
      .where('restaurants.id=:id', { id: idRestaurant })
      .orderBy('restaurants.id', 'ASC')
      .take(20)
      .skip(0)
      .getOne();
    return listVoucher;
  }
}
