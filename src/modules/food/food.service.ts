import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from './entity/food.entity';
import { Repository } from 'typeorm';
import { NewFoodDto } from './dto/food.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    private readonly restaurantServide: RestaurantService,
  ) {}
  async addFoodToRestaurant(id: number, newFood: NewFoodDto) {
    const restaurant = await this.restaurantServide.findOneRestaurantById(id);
    const newFoodInRestaurant = new Food();
    newFoodInRestaurant.foodName = newFood.foodName;
    newFoodInRestaurant.title = newFood.title;
    newFoodInRestaurant.total = newFood.total;
    newFoodInRestaurant.restaurant = restaurant;
    try {
      await this.foodRepository.save(newFoodInRestaurant);
      return newFoodInRestaurant;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async findFoodById(id: number) {
    const food = await this.foodRepository.findOneBy({ id });
    return food;
  }
}
