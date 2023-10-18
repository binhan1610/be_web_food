import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entity/restarant.entity';
import { Repository } from 'typeorm';
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}
  async addRestaurant(username: string, restaurantName: string) {
    const restaurant = await this.restaurantRepository.findOneBy({
      restaurantName,
    });
    if (restaurant) {
      throw new HttpException('Do Exist', HttpStatus.BAD_REQUEST);
    }
    const newRestaurant = new Restaurant();
    newRestaurant.restaurantName = restaurantName;
    newRestaurant.owner = username;
    try {
      await this.restaurantRepository.save(newRestaurant);
      return newRestaurant;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getAllRestaurnat(offset?: number, limit?: number) {
    const [data, total]: [Restaurant[], number] =
      await this.restaurantRepository
        .createQueryBuilder('restaurants')
        .take(limit ? limit : 100)
        .skip(offset ? offset : 0)
        .orderBy('restaurants.id', 'ASC')
        .getManyAndCount();
    return {
      data,
      total,
    };
  }
  async findOneRestaurantById(id) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id,
    });
    if (!restaurant) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return restaurant;
  }
  async findRestaurantByName(offset?: number, limit?: number, name?: string) {
    const [data, total]: [Restaurant[], number] =
      await this.restaurantRepository
        .createQueryBuilder('restaurants')
        .take(limit ? 20 : limit)
        .skip(offset ? 0 : offset)
        .where(
          'UPPER(restaurants.restaurantName) LIKE UPPER(:restaurantName)',
          {
            restaurantName: name ? `%${name}%` : 'Bún đậu làng quê',
          },
        )
        .orderBy('restaurants.id', 'ASC')
        .getManyAndCount();
    return {
      data,
      total,
    };
  }
  async getListFood(id: number) {
    try {
      const listFood = await this.restaurantRepository
        .createQueryBuilder('restaurants')
        .leftJoinAndSelect('restaurants.listFood', 'listFood')
        .where('restaurants.id=:id', { id })
        .orderBy('restaurants.id', 'ASC')
        .take(20)
        .skip(0)
        .getMany();
      return listFood;
    } catch (error) {
      console.log(error);
    }
  }
}
