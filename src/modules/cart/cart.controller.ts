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
  Get,
} from '@nestjs/common';
@Auth(Role.User)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addFoodToCart(@Body() food: FoodDto, @Req() request) {
    console.log(request.user);

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
  @Get(':id')
  async getDetailCartbyUserId(@Param('id') id: number) {
    const detailCart = await this.cartService.getCartByIdUser(id);
    return new HttpException(detailCart, HttpStatus.OK);
  }
  @Delete('/food/:idFood')
  async deleteFoodInCart(@Req() request, @Param('idFood') idFood: number) {
    const idCart = await this.cartService.getIdCartByidUser(request.user.id);
    const newCart = await this.cartService.deleteFoodInCart(idCart, idFood);
    return new HttpException(newCart, HttpStatus.OK);
  }
  @Post('/increasefood/:idFood')
  async increaseFoodInCart(@Param('idFood') idFood: number, @Req() request) {
    const idCart = await this.cartService.getIdCartByidUser(request.user.id);

    const newCart = await this.cartService.increaseAmountFood(idCart, idFood);
    return new HttpException(newCart, HttpStatus.OK);
  }
  @Post('/reducefood/:idFood')
  async reduceFoodInCart(@Param('idFood') idFood: number, @Req() request) {
    const idCart = await this.cartService.getIdCartByidUser(request.user.id);

    const newCart = await this.cartService.reduceAmountFood(idCart, idFood);
    return new HttpException(newCart, HttpStatus.OK);
  }
}
