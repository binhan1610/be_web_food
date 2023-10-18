import {
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { NewFoodDto } from './dto/food.dto';

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
}
