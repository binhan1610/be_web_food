import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entity/restarant.entity';
import { Repository } from 'typeorm';
import { NewRestaurant } from '../authentication/DTO/newRestaurant.dto';
import { RestaurantOwner } from './entity/restaurantOwner.entity';
import { User } from '../user/entities/user.entity';
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(RestaurantOwner)
    private readonly restaurantOwnerRepository: Repository<RestaurantOwner>,
  ) {}
  async addRestaurant(user: User, newRestaurant: NewRestaurant) {
    if (user.owner) {
    }
    const checkRestaurant = await this.restaurantRepository.findOneBy({
      restaurantName: newRestaurant.restaurantName,
    });

    if (checkRestaurant) {
      // return false;
      throw new HttpException('restaurant does exist', HttpStatus.BAD_REQUEST);
    }

    const restaurant = new Restaurant();

    restaurant.address = newRestaurant.address;
    restaurant.restaurantName = newRestaurant.restaurantName;
    restaurant.typeOfFood = newRestaurant.typeOfFood;
    const owner = new RestaurantOwner();
    owner.author = user;
    owner.restaurant = restaurant;
    restaurant.owner = owner;
    // newRestaurant1.owner = username;

    try {
      await this.restaurantOwnerRepository.save(owner);
      await this.restaurantRepository.save(restaurant);
      const resRestaurant = await this.restaurantRepository.findOneBy({
        restaurantName: newRestaurant.restaurantName,
      });

      return resRestaurant;
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
  async findOneRestaurantByRestaurantName(restaurantName: string) {
    const restaurant = await this.restaurantRepository.findOneBy({
      restaurantName,
    });
    return restaurant;
  }
  async findOneRestaurantById(id: number) {
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
