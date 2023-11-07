import { diskStorage } from 'multer';
import { DATABASE_USERNAME } from './../../configs/config';
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
import { PaginationParams } from './dto/paginationParams.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
@Auth(Role.Owner)
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

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
  @Get('/owner')
  async getAllOwner() {
    const listOwner = await this.restaurantService.getAllOwner();
    return new HttpException(listOwner, HttpStatus.OK);
  }
  @Get('/user')
  async getRestaurantByUser(@Req() request) {
    const restaurant = await this.restaurantService.getRestaurantByUser(
      request.user.username,
    );
    return new HttpException(restaurant, HttpStatus.OK);
  }
  @Post('/avataimage/:idRestaurant')
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
  async setAvatarRestaurant(
    @UploadedFile() image,
    @Param('idRestaurant') id: number,
  ) {
    const destination = `uploads/${image.originalname}`;
    const url = await this.restaurantService.uploadFile(
      image.path,
      destination,
    );
    const restaurant = await this.restaurantService.setAvatarRestaurant(
      id,
      url,
    );

    return restaurant;
  }
  @Post('/backgroundimage/:idRestaurant')
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
  async setBackgroundRestaurant(
    @UploadedFile() image,
    @Param('idRestaurant') id: number,
  ) {
    const destination = `uploads/${image.originalname}`;
    const url = await this.restaurantService.uploadFile(
      image.path,
      destination,
    );
    const restaurant = await this.restaurantService.setBackgroundRestaurant(
      id,
      url,
    );

    return restaurant;
  }
}
