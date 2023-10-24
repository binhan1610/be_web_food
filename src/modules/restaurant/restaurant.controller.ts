import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  HttpException,
  HttpStatus,
  Query,
  Param,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
import { PaginationParams } from './dto/paginationParams.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Auth(Role.User)
  @Get('all')
  async getAllRestaurant(@Query() { offset, limit }: PaginationParams) {
    const restaurants = await this.restaurantService.getAllRestaurnat(
      offset,
      limit,
    );
    return new HttpException(restaurants, HttpStatus.OK);
  }
  @Get()
  async findRestaurantByName(
    @Query('name') name: string,
    @Query() { offset, limit }: PaginationParams,
  ) {
    const restaurant = await this.restaurantService.findRestaurantByName(
      offset,
      limit,
      name,
    );
    return new HttpException(restaurant, HttpStatus.OK);
  }
  @Get('food/:id')
  async getListFood(@Param('id') id: number) {
    const listFood = await this.restaurantService.getListFood(id);
    return new HttpException(listFood, HttpStatus.OK);
  }
}
