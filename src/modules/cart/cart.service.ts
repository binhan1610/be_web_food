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
    const restaurant = await this.foodServide.getRestaurantByFood(idFood);
    let cart = await this.cartRepository.findOne({
      where: { author: { id: user.id }, status: 'order' },
    });

    if (!cart) {
      cart = await this.cartRepository.create({
        status: 'order',
        author: user,
        detailFood: [],
        total: 0,
        restaurant: restaurant,
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
      cart.detailFood.push(detailFoodInCart);
    } else {
      detailFoodInCart.amount += Number(totalFood);
      detailFoodInCart.total += Number(totalInDetailFoodInCart);
    }

    cart.total += food.total * totalFood;
    try {
      await this.detailRepository.save(detailFoodInCart);

      await this.cartRepository.save(cart);
    } catch (error) {
      console.log(error);
    }
    const resCart = await this.cartRepository
      .createQueryBuilder('carts')
      .where('carts.author=:id AND carts.status=:status', {
        id: user.id,
        status: 'order',
      })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    return resCart;
  }

  // async deleteCart(id: number) {
  //   try {
  //     // Tìm bản ghi cart cần xóa từ cơ sở dữ liệu
  //     const cartToDelete = await this.cartRepository.findOne({ where: { id } });

  //     if (cartToDelete) {
  //       // Thực hiện xóa bản ghi cart và các bản ghi liên quan trong bảng detailFood
  //       await this.cartRepository.remove(cartToDelete);
  //     } else {
  //       console.log('Bản ghi không tồn tại');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  async getCartByIdUser(id: number) {
    const detailCart = await this.cartRepository
      .createQueryBuilder('carts')
      .where('carts.id=:id AND carts.status=:status', {
        id: id,
        status: 'order',
      })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    if (!detailCart) return null;
    return detailCart;
  }
  async getIdCartByidUser(idUser: number) {
    const cart = await this.cartRepository.findOne({
      where: { author: { id: idUser }, status: 'order' },
    });
    return cart.id;
  }
  async getCartByUsername(username: string) {
    const cart = await this.cartRepository.findOne({
      where: { author: { username: username }, status: 'order' },
    });
    if (!cart) return null;
    return cart;
  }
  async deleteFoodInCart(idCart: number, idFood: number) {
    const findFood = await this.detailRepository.findOne({
      where: {
        cart: { id: idCart, status: 'order' },
        foodInCart: { id: idFood },
      },
    });
    if (!findFood)
      throw new HttpException('not found food in cart', HttpStatus.NOT_FOUND);
    await this.detailRepository.remove(findFood);
    const cart = await this.cartRepository.findOneBy({ id: idCart });
    cart.total -= findFood.total;
    await this.cartRepository.save(cart);
    const detailCart = await this.cartRepository
      .createQueryBuilder('carts')
      .where('carts.id=:id AND carts.status=:status', {
        id: idCart,
        status: 'order',
      })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    return detailCart;
  }
  async increaseAmountFood(idCart: number, idFood: number) {
    const cart = await this.cartRepository.findOneBy({
      id: idCart,
      status: 'order',
    });
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
      .where('carts.id=:id AND carts.status=:status', {
        id: idCart,
        status: 'order',
      })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    return detailCart;
  }
  async reduceAmountFood(idCart: number, idFood: number) {
    const cart = await this.cartRepository.findOneBy({
      id: idCart,
      status: 'order',
    });
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
      .where('carts.id=:id AND carts.status=:status', {
        id: idCart,
        status: 'order',
      })
      .leftJoinAndSelect('carts.detailFood', 'detailFood')
      .leftJoinAndSelect('detailFood.foodInCart', 'foodInCart')
      .getOne();
    return detailCart;
  }
  async setDoneCart(idCart: number) {
    const cart = await this.cartRepository.findOneBy({ id: idCart });
    if (!cart) throw new HttpException('NOT FOUND', HttpStatus.BAD_REQUEST);
    cart.status = 'ordered';
    this.cartRepository.save(cart);
  }
}
