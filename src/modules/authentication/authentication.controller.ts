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
    console.log(user);

    const accessToekn = await this.authenticationservice.getJWTToken(
      user.username,
    );
    const refreshtoken = await this.authenticationservice.getJWTRefreshToken(
      user.username,
    );
    await this.userservice.setCurrentRefreshToken(refreshtoken, user.username);
    const data = [
      {
        accessToekn: accessToekn,
        refreshtoken: refreshtoken,
      },
    ];
    return new HttpException({ message: 'login success', data }, HttpStatus.OK);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const accsessToken = await this.authenticationservice.getJWTToken(
      request.user.username,
    );
    return { accessToken: accsessToken };
  }
}
