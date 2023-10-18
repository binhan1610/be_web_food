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
@ApiTags('Authentication')
@Injectable() //quản lý sự phụ thuộc giữa các thành phần trong ứng dụng NestJS và tạo điều kiện cho việc sử dụng dependency injection để tạo và chia sẻ các instance của các class này.
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtservice: JwtService,
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

      account.roles = ['user'];
      account.username = newuser.username;
      account.password = hash;
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
    const token = this.jwtservice.sign(payload);
    return token;
  }
  public getJWTRefreshToken(username: string) {
    const payload: TokenPayload = { username };
    const refreshtoken = this.jwtservice.sign(payload, {
      secret: JWT_SECRET_REFRESH_TOKEN,
      expiresIn: JWT_SECRET_EXPIRED_REFRESH_TOKEN,
    });
    return refreshtoken;
  }
}
