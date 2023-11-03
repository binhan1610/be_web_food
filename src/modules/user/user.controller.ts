import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UpdateUserDto } from './DTO/updateUser.dto';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':username')
  @ApiParam({ name: 'username', description: 'username' })
  async deleteUserByUsername(@Param('username') username: string) {
    try {
      await this.userService.deleteUserByUsername(username);
    } catch (error) {
      console.log(error);
      return new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'idUser' })
  async deleteUserById(@Param('id') id: number) {
    try {
      await this.userService.deleteUserById(id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
  @Put()
  async updateUser(@Body() username: string, updateUserDto: UpdateUserDto) {
    const user = await this.userService.updateUser(username, updateUserDto);
    return new HttpException(
      { message: 'update success', user: user },
      HttpStatus.OK,
    );
  }
  @Post('vip/:id')
  async registerUserVip(@Param('id') id: number) {
    const user = await this.userService.registerVipUser(id);
    return new HttpException('register success', HttpStatus.OK);
  }
  @Get()
  @Auth(Role.User)
  async getRoleUser() {
    return true;
  }
}
