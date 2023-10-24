import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { FoodService } from '../food/food.service';
import { DetailFoodInCart } from './entities/detailfoodincart.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(DetailFoodInCart)
    private readonly detailRepository: Repository<DetailFoodInCart>,
    private readonly userService: UserService,
    private readonly foodServide: FoodService,
  ) {}
  async addFoodToCart(username: string, idFood: number, totalFood: number) {
    const user = await this.userService.getUserByUsername(username);
    const food = await this.foodServide.findFoodById(idFood);
    let cart = await this.cartRepository.findOne({
      where: { author: { id: user.id } },
    });
    console.log(cart);
    if (!cart) {
      cart = await this.cartRepository.create({
        author: user,
        detailFood: [],
        total: 0,
      });
      await this.cartRepository.save(cart);
    }
    let detailFoodInCart = await this.detailRepository.findOne({
      where: { cart: { id: cart.id }, foodInCart: { id: idFood } },
    });
    console.log(detailFoodInCart);
    const totalInDetailFoodInCart = food.total * totalFood;
    if (!detailFoodInCart) {
      detailFoodInCart = await this.detailRepository.create({
        cart: cart,
        amount: totalFood,
        foodInCart: food,
        total: totalInDetailFoodInCart,
      });
    } else {
      detailFoodInCart.amount += Number(totalFood);
      detailFoodInCart.total += Number(totalInDetailFoodInCart);
    }
    await this.detailRepository.save(detailFoodInCart);

    cart.total += food.total * totalFood;
    await this.cartRepository.save(cart);
    // const resCart = await this.cartRepository
    //   .createQueryBuilder('carts')
    //   .where('carts.author=:id', { id: user.id })
    //   .leftJoinAndSelect('carts.detailFood', 'detailFood')
    //   .getOne();
    // return resCart;
    return cart;
  }

  async deleteCart(id: number) {
    try {
      await this.cartRepository.delete(id);
    } catch (error) {
      console.log(error);
    }
  }
  async getCartByIdUser(id: number) {
    try {
      const detailCart = await this.cartRepository
        .createQueryBuilder('carts')
        .where('carts.author=:id', { id })
        .leftJoinAndSelect('carts.detailFood', 'detailFood')
        .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
        .getOne();
      return detailCart;
      // const cart = await this.cartRepository.findOne({
      //   where: { author: { id: id } },
      // });
      // return cart;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async getIdCartByidUser(idUser: number) {
    const cart = await this.cartRepository.findOne({
      where: { author: { id: idUser } },
    });
    return cart.id;
  }
  async deleteFoodInCart(idCart: number, idFood: number) {
    const findFood = await this.detailRepository.findOne({
      where: { cart: { id: idCart }, foodInCart: { id: idFood } },
    });
    if (!findFood)
      throw new HttpException('not found food in cart', HttpStatus.NOT_FOUND);
    await this.detailRepository.remove(findFood);
    const cart = await this.cartRepository.findOneBy({ id: idCart });
    cart.total -= findFood.total;
    await this.cartRepository.save(cart);
    const detailCart = await this.cartRepository
      .createQueryBuilder('carts')
      .where('carts.id=:id', { id: idCart })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    return detailCart;
  }
  async increaseAmountFood(idCart: number, idFood: number) {
    const cart = await this.cartRepository.findOneBy({ id: idCart });
    const food = await this.foodServide.findFoodById(idFood);
    const findFood = await this.detailRepository.findOne({
      where: { cart: { id: idCart }, foodInCart: { id: idFood } },
    });

    if (!findFood) {
      throw new HttpException('not Found', HttpStatus.NOT_FOUND);
    }
    findFood.amount += 1;
    findFood.total += food.total;
    cart.total += food.total;
    await this.detailRepository.save(findFood);
    await this.cartRepository.save(cart);
    const detailCart = await this.cartRepository
      .createQueryBuilder('carts')
      .where('carts.id=:id', { id: idCart })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    return detailCart;
  }
  async reduceAmountFood(idCart: number, idFood: number) {
    const cart = await this.cartRepository.findOneBy({ id: idCart });
    const food = await this.foodServide.findFoodById(idFood);
    const findFood = await this.detailRepository.findOne({
      where: { cart: { id: idCart }, foodInCart: { id: idFood } },
    });
    if (!findFood) {
      throw new HttpException('not Found', HttpStatus.NOT_FOUND);
    }
    if (findFood.amount === 1) {
      await this.detailRepository.remove(findFood);
    }
    findFood.amount -= 1;
    findFood.total -= food.total;
    cart.total -= food.total;
    await this.detailRepository.save(findFood);
    await this.cartRepository.save(cart);
    const detailCart = await this.cartRepository
      .createQueryBuilder('carts')
      .where('carts.id=:id', { id: idCart })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    return detailCart;
  }
}
