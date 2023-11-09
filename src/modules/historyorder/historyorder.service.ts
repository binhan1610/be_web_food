import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryOrder } from './entity/historyorder.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryOrderService {
  constructor(
    @InjectRepository(HistoryOrder)
    private readonly historyOrderRepository: Repository<HistoryOrder>,
  ) {}
  public async saveHistoryOrder(historyOrder: HistoryOrder) {
    try {
      await this.historyOrderRepository.save(historyOrder);
      return historyOrder;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  public async getAllOrderByUsername(username: string) {
    const status = 'da thanh toan';
    const listOrder = await this.historyOrderRepository
      .createQueryBuilder('historyorder')
      .leftJoinAndSelect('historyorder.information', 'information')
      .leftJoin('information.author', 'author')
      .where('author.username=:username AND information.status=:status', {
        username,
        status,
      })
      .getMany();
    return listOrder;
  }
  public async getdetailHistoryOrder(idHistoryOrder: number) {
    const historyOrder = await this.historyOrderRepository
      .createQueryBuilder('historyorder')
      .leftJoinAndSelect('historyorder.information', 'information')
      .leftJoinAndSelect('information.cart', 'cart')
      .leftJoinAndSelect('information.voucher', 'voucher')
      .where('historyorder.id=:id', { id: Number(idHistoryOrder) })
      .getOne();
    if (!historyOrder) throw new HttpException('Not Found', HttpStatus.OK);
    return historyOrder;
  }
}
