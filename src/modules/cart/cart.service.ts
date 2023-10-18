import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { FoodService } from '../food/food.service';
import { DetailFoodInCart } from './entities/detailfoodincart.entity';

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
    if (!detailFoodInCart) {
      detailFoodInCart = await this.detailRepository.create({
        cart: cart,
        amount: totalFood,
        foodInCart: food,
      });
    } else {
      detailFoodInCart.amount += totalFood;
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
}
