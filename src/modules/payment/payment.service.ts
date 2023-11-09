import { HistoryOrderService } from '../historyorder/historyorder.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';
import { CartService } from '../cart/cart.service';
import { VoucherService } from '../vourcher/voucher.service';
import { NewPayment } from './dto/payment.dto';
import { UserService } from '../user/user.service';
import * as moment from 'moment-timezone';
import { HistoryOrder } from '../historyorder/entity/historyorder.entity';
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly cartService: CartService,
    private readonly voucherService: VoucherService,
    private readonly userService: UserService,
    private readonly historyOrderService: HistoryOrderService,
  ) {}
  public async getPayment(username: string) {
    let payment = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.author', 'author')
      .leftJoinAndSelect('payment.voucher', 'voucher')
      .leftJoinAndSelect('payment.cart', 'cart')
      .leftJoinAndSelect('cart.detailFood', 'detailFood')
      .where('author.username=:username AND payment.status=:status', {
        username,
        status: 'chua thanh toan',
      })
      .getOne();
    if (!payment) return [];
    return payment;
  }
  public async addVoucher(idVoucher: number, username: string) {
    let payment = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.author', 'author')
      .leftJoinAndSelect('payment.voucher', 'voucher')
      .leftJoinAndSelect('payment.cart', 'cart')
      .leftJoinAndSelect('cart.detailFood', 'detailFood')
      .where('author.username=:username', { username })
      .getOne();
    const voucher = await this.voucherService.getVoucherByIdVoucher(idVoucher);
    payment.voucher = voucher;
    payment.quantity =
      Number(payment.cart.total) - Number(voucher.discountAmount);
    await this.paymentRepository.save(payment);

    return payment;
  }
  public async creatPayment(username: string) {
    let payment = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.author', 'author')
      .leftJoinAndSelect('payment.voucher', 'voucher')
      .leftJoinAndSelect('payment.cart', 'cart')
      .leftJoinAndSelect('cart.detailFood', 'detailFood')
      .where('author.username=:username AND payment.status=:status', {
        username,
        status: 'chua thanh toan',
      })
      .getOne();

    if (payment) return payment;
    const user = await this.userService.getUserByUsername(username);
    const cart = await this.cartService.getCartByUsername(username);
    console.log(cart);

    payment = new Payment();
    payment.datepayment = moment.tz('Asia/Ho_Chi_Minh').format();
    payment.status = 'chua thanh toan';
    payment.author = user;
    payment.cart = cart;
    payment.quantity = Number(cart.total);

    await this.paymentRepository.save(payment);
    payment.author = null;
    return payment;
  }
  public async payment(username: string, newPayment: NewPayment) {
    const payment = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoin('payment.author', 'author')
      .leftJoinAndSelect('payment.voucher', 'voucher')
      .leftJoinAndSelect('payment.cart', 'cart')
      .leftJoinAndSelect('cart.detailFood', 'detailFood')
      .where('author.username = :username AND payment.status = :status', {
        username,
        status: 'chua thanh toan',
      })
      .getOne();

    if (!payment)
      throw new HttpException('Dont have payment', HttpStatus.BAD_REQUEST);
    payment.status = 'da thanh toan';
    payment.paymentMethods = newPayment.paymentMethods;
    await this.cartService.setDoneCart(payment.cart.id);
    await this.paymentRepository.save(payment);
    const historiOrder = new HistoryOrder();
    historiOrder.information = payment;

    await this.historyOrderService.saveHistoryOrder(historiOrder);
    return historiOrder;
  }
}
