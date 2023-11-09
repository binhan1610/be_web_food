import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entity/restarant.entity';
import { Repository } from 'typeorm';
import { NewRestaurant } from '../authentication/DTO/newRestaurant.dto';
import { RestaurantOwner } from './entity/restaurantOwner.entity';
import { User } from '../user/entities/user.entity';
import {
  CLIENT_EMAIL,
  PRIVATE_KEY,
  PROJECT_ID,
  STORAGE_BUCKET_URL,
} from 'src/configs/config';

import * as admin from 'firebase-admin';
@Injectable()
export class RestaurantService {
  constructor(
    @Inject('FirebaseAdmin') private readonly admin: admin.app.App,
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
    restaurant.rate = 5;
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
  public async getAllOwner(offset?: number, limit?: number) {
    const [data, total]: [RestaurantOwner[], number] =
      await this.restaurantOwnerRepository
        .createQueryBuilder('restaurantOwner')
        .leftJoinAndSelect('restaurantOwner.author', 'author')
        .take(limit ? limit : 100)
        .skip(offset ? offset : 0)
        .orderBy('restaurantOwner.id', 'ASC')
        .getManyAndCount();
    return {
      data,
      total,
    };
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
  public async getListFood(id: number) {
    try {
      const listFood = await this.restaurantRepository
        .createQueryBuilder('restaurants')
        .leftJoinAndSelect('restaurants.listFood', 'listFood')
        .where('restaurants.id=:id', { id })
        .orderBy('restaurants.id', 'ASC')
        .take(20)
        .skip(0)
        .getOne();
      return listFood;
    } catch (error) {
      console.log(error);
    }
  }
  public async getRestaurantByUser(username: string) {
    const owner = await this.restaurantOwnerRepository
      .createQueryBuilder('restaurantOwner')
      .leftJoinAndSelect('restaurantOwner.author', 'author')
      .where('author.username=:username', {
        username,
      })
      .getOne();

    const restaurant = await this.restaurantRepository
      .createQueryBuilder('restaurants')
      .leftJoinAndSelect('restaurants.owner', 'owner')
      .where('restaurants.owner.id=:id', { id: owner.id })
      .getOne();

    return restaurant;
  }
  async uploadFile(
    localFilePath: string,
    destination: string,
  ): Promise<string> {
    const storage = this.admin.storage().bucket();

    await storage.upload(localFilePath, { destination });

    const file = storage.file(destination);
    const url = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 10 * 60 * 60 * 1000,
    });
    return url[0];
  }
  async setAvatarRestaurant(idRestaurant: number, url: string) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: idRestaurant,
    });
    if (!restaurant)
      throw new HttpException('restaurant not found', HttpStatus.BAD_REQUEST);
    restaurant.imgAvatar = url;
    await this.restaurantRepository.save(restaurant);
    return restaurant;
  }
  async setBackgroundRestaurant(idRestaurant: number, url: string) {
    const restaurant = await this.restaurantRepository.findOneBy({
      id: idRestaurant,
    });
    if (!restaurant)
      throw new HttpException('restaurant not found', HttpStatus.BAD_REQUEST);
    restaurant.imgBackground = url;
    await this.restaurantRepository.save(restaurant);
    return restaurant;
  }
  public async saveRestaurant(restaurant: Restaurant) {
    const restaurantSave = await this.restaurantRepository.save(restaurant);
    return restaurantSave;
  }
}
