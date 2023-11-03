import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { NewFoodDto } from './dto/food.dto';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
@Auth(Role.User)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @Post(':id')
  async addFoodToRestaurant(
    @Body() foodDto: NewFoodDto,
    @Param('id') id: number,
  ) {
    const food = await this.foodService.addFoodToRestaurant(id, foodDto);
    return new HttpException(
      { food, message: 'Add Food Success' },
      HttpStatus.OK,
    );
  }
  @Get('/restaurant/:id')
  async getRestaurantByFood(@Param('id') id: number) {
    const restaurant = await this.foodService.getRestaurantByFood(id);
    return new HttpException(restaurant, HttpStatus.OK);
  }
}
