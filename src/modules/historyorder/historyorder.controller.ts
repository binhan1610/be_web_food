import { HistoryOrderService } from './historyorder.service';

import { Role } from 'src/Enum/role.enum';
import {
  Controller,
  Get,
  Req,
  Param,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { Auth } from 'src/decorator/roles.decorator';

@Controller('historyorder')
@Auth(Role.User)
export class HistoryOrderController {
  constructor(private readonly historyOrderService: HistoryOrderService) {}
  @Get()
  async getAllHistoryOrderbyUser(@Req() request) {
    const listHistoruOrder =
      await this.historyOrderService.getAllOrderByUsername(
        request.user.username,
      );
    return new HttpException(listHistoruOrder, HttpStatus.OK);
  }
  @Get('/detail/:id')
  async getDetailHistoryOrder(@Param('id') idHistoryOrder: number) {
    const detail =
      await this.historyOrderService.getdetailHistoryOrder(idHistoryOrder);
    return new HttpException(detail, HttpStatus.OK);
  }
}
