import { RestaurantService } from './../restaurant/restaurant.service';
import { UserService } from './../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { NewComment } from './dto/comment.dto';
import { Injectable } from '@nestjs/common';
import { Restaurant } from '../restaurant/entity/restarant.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userservice: UserService,
    private readonly restaurantService: RestaurantService,
  ) {}
  public async sentComment(
    newComment: NewComment,
    username: string,
    idRestaurant: number,
  ): Promise<any> {
    const user = await this.userservice.getUserByUsername(username);
    const restaurant = await this.setRateRestaurant(
      idRestaurant,
      newComment.rate,
    );
    const comment = new Comment();
    comment.author = user;
    comment.restaurant = restaurant;
    comment.rate = newComment.rate;
    comment.comment = newComment.comment;

    await this.commentRepository.save(comment);

    comment.author = null;
    return comment;
  }
  public async setRateRestaurant(idRestaurant: number, rate: number) {
    let restaurant =
      await this.restaurantService.findOneRestaurantById(idRestaurant);

    const newRate = (Number(restaurant.rate) + Number(rate)) / 2;

    restaurant.rate = newRate;
    restaurant = await this.restaurantService.saveRestaurant(restaurant);
    return restaurant;
  }
  public async getAllCommentByRestaurant(idRestaurant: number) {
    const listComment = await this.commentRepository.find({
      where: { restaurant: { id: idRestaurant } },
    });
    if (!listComment) return [];
    return listComment;
  }
}
