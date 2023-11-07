import { diskStorage } from 'multer';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { NewFoodDto } from './dto/food.dto';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
@Auth(Role.User)
@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
  @Post(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, Date.now() + extname(file.originalname));
        },
      }),
    }),
  )
  async addFoodToRestaurant(
    @UploadedFile() image,
    @Body() foodDto: NewFoodDto,
    @Param('id') id: number,
  ) {
    const destination = `uploads/${image.originalname}`;
    const food = await this.foodService.addFoodToRestaurant(
      id,
      foodDto,
      destination,
      image.path,
    );
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
