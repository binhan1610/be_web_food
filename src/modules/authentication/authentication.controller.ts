import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewUserDTO, LogIn } from './DTO/newUser.DTO';
import { AuthenticationService } from './authentication.service';

import RequestWithUser from './Interface/RequestWithUser.interface';
import { UserService } from '../user/user.service';
import { LocalAuthenticationGuard } from 'src/guard/localAuthentication.guard';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/guard/jwt-authentication.guard';
import { Auth } from 'src/decorator/roles.decorator';
import { Role } from 'src/Enum/role.enum';
import { NewRestaurant } from './DTO/newRestaurant.dto';
@ApiTags('Authentication')
@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationservice: AuthenticationService,
    private readonly userservice: UserService,
  ) {}
  @Post('register')
  async register(@Body() newuserdto: NewUserDTO) {
    return this.authenticationservice.register(newuserdto);
  }

  @Post('login')
  @UseGuards(LocalAuthenticationGuard)
  async login(@Body() user: LogIn) {
    const accessToken = await this.authenticationservice.getJWTToken(
      user.username,
    );
    const refreshToken = await this.authenticationservice.getJWTRefreshToken(
      user.username,
    );
    await this.userservice.setCurrentRefreshToken(refreshToken, user.username);
    const data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return new HttpException(data, HttpStatus.OK);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const accsessToken = await this.authenticationservice.getJWTToken(
      request.user.username,
    );
    return { accessToken: accsessToken };
  }
  @Auth(Role.User)
  @Post('/registerowner')
  async registerOwner(@Req() request, @Body() newRestaurant: NewRestaurant) {
    const restaurant: any = await this.authenticationservice.registerOwner(
      request.user.username,
      newRestaurant,
    );

    return new HttpException(restaurant, HttpStatus.OK);
  }
  @Auth(Role.Owner)
  @Get('owner')
  async getRoleOwner() {
    return true;
  }
}
