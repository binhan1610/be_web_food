import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Get,
} from '@nestjs/common';
import { Role } from 'src/Enum/role.enum';
import { Auth } from 'src/decorator/roles.decorator';
import { CommentService } from './comment.service';
import { NewComment } from './dto/comment.dto';
@Auth(Role.User)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('/:idRestaurant')
  async senComment(
    @Param('idRestaurant') id: number,
    @Body() newComment: NewComment,
    @Req() request,
  ) {
    console.log(request.user);

    const commnet = await this.commentService.sentComment(
      newComment,
      request.user.username,
      id,
    );
    return new HttpException(commnet, HttpStatus.OK);
  }
  @Get('/:idRestaurant')
  async getComment(@Param('idRestaurant') id: number) {
    const listComment = await this.commentService.getAllCommentByRestaurant(id);
    return new HttpException(listComment, HttpStatus.OK);
  }
}
