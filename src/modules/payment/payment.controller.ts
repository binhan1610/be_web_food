import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { NewPayment } from './dto/payment.dto';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
import { request } from 'http';
@Auth(Role.User)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get()
  async getPayment(@Req() request) {
    const payment = await this.paymentService.getPayment(request.user.username);
    return new HttpException(payment, HttpStatus.OK);
  }
  @Post('/addvoucher/:idVoucher')
  async addVoucher(@Param('idVoucher') idVoucher: number, @Req() request) {
    const payment = await this.paymentService.addVoucher(
      idVoucher,
      request.user.username,
    );
    return new HttpException(payment, HttpStatus.OK);
  }
  @Post('/create')
  async createPayment(@Req() request) {
    const payment = await this.paymentService.creatPayment(
      request.user.username,
    );
    return new HttpException(payment, HttpStatus.OK);
  }
  @Post('/done')
  async payment(@Req() request, @Body() newPayment: NewPayment) {
    const historyorder = await this.paymentService.payment(
      request.user.username,
      newPayment,
    );
    return new HttpException(historyorder, HttpStatus.OK);
  }
}
