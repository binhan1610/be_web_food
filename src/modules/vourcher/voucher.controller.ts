import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { NewVoucher } from './dto/newVoucher.dto';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
@Auth(Role.User)
@Controller('voucher')
export class VourcherController {
  constructor(private readonly voucherService: VoucherService) {}
  @Post(':id')
  async addVoucherByRestaurant(
    @Param('id') id: number,
    @Body() newVoucher: NewVoucher,
  ) {
    const voucher = await this.voucherService.addVoucherRestaurant(
      id,
      newVoucher,
    );
    return new HttpException(voucher, HttpStatus.OK);
  }
  @Get('/:id')
  async getAllvoucherByIdRestaurant(@Param('id') id: number) {
    const lisVoucher =
      await this.voucherService.getAllVouCherByIdRestaurant(id);
    return new HttpException(lisVoucher, HttpStatus.OK);
  }
}
