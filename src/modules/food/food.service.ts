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
  async addFoodToRestaurant(
    id: number,
    newFood: NewFoodDto,
    destination: string,
    imagePath: string,
  ) {
    const restaurant = await this.restaurantServide.findOneRestaurantById(id);

    let food = await this.foodRepository.findOneBy({
      foodName: newFood.foodName,
    });
    const urlImage = await this.restaurantServide.uploadFile(
      imagePath,
      destination,
    );

    if (food) {
      throw new HttpException('Food existed', HttpStatus.BAD_REQUEST);
    }
    const newFoodInRestaurant = new Food();
    newFoodInRestaurant.foodName = newFood.foodName;
    newFoodInRestaurant.title = newFood.title;
    newFoodInRestaurant.total = Number(newFood.total);
    newFoodInRestaurant.img = String(urlImage);
    newFoodInRestaurant.restaurant = restaurant;

    await this.foodRepository.save(newFoodInRestaurant);
    return newFoodInRestaurant;
  }
  async findFoodById(id: number) {
    const food = await this.foodRepository.findOneBy({ id });
    return food;
  }
  async getRestaurantByFood(foodId: number) {
    const food = await this.foodRepository
      .createQueryBuilder('foods')
      .leftJoinAndSelect('foods.restaurant', 'restaurants')
      .where('foods.id=:id', { id: foodId })
      .getOne();
    return food.restaurant;
  }
}
