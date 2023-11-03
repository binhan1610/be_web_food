import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewUserDTO } from './DTO/newUser.DTO';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  JWT_SECRET_EXPIRED_REFRESH_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
  SALTROUNDS,
} from 'src/configs/config';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserVip } from '../user/entities/vipuser.entity';
import { NewRestaurant } from './DTO/newRestaurant.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
@ApiTags('Authentication')
@Injectable() //quản lý sự phụ thuộc giữa các thành phần trong ứng dụng NestJS và tạo điều kiện cho việc sử dụng dependency injection để tạo và chia sẻ các instance của các class này.
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtservice: JwtService,
    private readonly restaurantService: RestaurantService,
  ) {}

  public async register(newuser: NewUserDTO): Promise<any> {
    const user = await this.userService.getUserByUsername(newuser.username);
    if (user) {
      throw new HttpException('Tài khoản đã tồn tại', HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt(SALTROUNDS);
    const hash = await bcrypt.hash(newuser.password, salt);
    try {
      const account = new User();
      const userVip = new UserVip();
      userVip.isVip = false;
      account.userVip = userVip;
      account.roles = ['user'];
      account.username = newuser.username;
      account.password = hash;
      account.email = newuser.email;
      account.phonenumber = newuser.phoneNumber;
      await this.userService.addUser(account);
      return new HttpException(account, HttpStatus.CREATED);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private async verifyPassword(password: string, hashpassword: string) {
    // xem 2 mật khẩu match nhau không
    const isPasswordMatching = await bcrypt.compare(password, hashpassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public async getAuthenticationUser(username: string, password: string) {
    try {
      const haspassword =
        await this.userService.getPasswordByUsername(username);
      const user = await this.userService.getUserByUsername(username);
      await this.verifyPassword(password, haspassword);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public async getJWTToken(username: string) {
    const payload: TokenPayload = { username };
    const token = await this.jwtservice.sign(payload);
    return token;
  }
  public async getJWTRefreshToken(username: string) {
    const payload: TokenPayload = { username };
    const refreshtoken = await this.jwtservice.sign(payload, {
      secret: JWT_SECRET_REFRESH_TOKEN,
      expiresIn: JWT_SECRET_EXPIRED_REFRESH_TOKEN,
    });
    return refreshtoken;
  }
  public async registerOwner(username: string, newRestaurant: NewRestaurant) {
    const user = await this.userService.checkOwner(username);
    const restaurant =
      await this.restaurantService.findOneRestaurantByRestaurantName(
        newRestaurant.restaurantName,
      );

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    if (user.owner) {
      throw new HttpException(
        'restaurant of user does exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (restaurant) {
      throw new HttpException('Restaurant does exist', HttpStatus.BAD_REQUEST);
    }
    try {
      const restaurant: any = await this.restaurantService.addRestaurant(
        user,
        newRestaurant,
      );
      console.log(restaurant);

      await this.userService.addRoleUser(username, 'owner');

      return restaurant;
    } catch (error) {
      console.log(error);
    }
  }
  public async getRole(username: string) {
    const user = await this.userService.getUserByUsername(username);
    return user.roles;
  }
}
