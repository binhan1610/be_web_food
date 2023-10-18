import { Auth } from 'src/decorator/roles.decorator';
import { CartService } from './cart.service';
import { Role } from 'src/Enum/role.enum';
import { FoodDto } from './dto/Food.dto';
import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Auth(Role.User)
  @Post()
  async addFoodToCart(@Body() food: FoodDto, @Req() request) {
    const cart = await this.cartService.addFoodToCart(
      request.user.username,
      food.foodId,
      food.total,
    );
    return cart;
  }
  @Delete(':id')
  async deleteCart(@Param('id') id: number) {
    await this.cartService.deleteCart(id);
    return new HttpException('Delete Success', HttpStatus.OK);
  }
}
