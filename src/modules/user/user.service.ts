import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './DTO/updateUser.dto';
import { use } from 'passport';

export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  public async getUserByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });

    return user;
  }
  public async addUser(newuser: User) {
    await this.userRepository.save(newuser);
  }
  public async getPasswordByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();
    return user.password;
  }
  public async setCurrentRefreshToken(refreshtoken: string, username: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshtoken, 10);
    const user = await this.getUserByUsername(username);
    await this.userRepository.update(user.id, {
      refreshToken: currentHashedRefreshToken,
    });
  }
  public async deleteUserByUsername(username: string) {
    const user = await this.getUserByUsername(username);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete({ username: username });
  }
  public async deleteUserById(id: number) {
    const user = this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new HttpException('User not Found', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.delete({ id: id });
  }
  public async getRefreshTokenByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.refreshtoken')
      .where('user.username= :username', { username })
      .getOne();
    return user;
  }
  public async getUserIfRefreshTokenMatch(
    refreshToken: string,
    username: string,
  ) {
    const user = await this.getUserByUsername(username);
    const ifRefreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (ifRefreshTokenMatch) {
      user.refreshToken = undefined;
      return user;
    } else throw new UnauthorizedException('refresh token khong hop le');
  }
  public async updateUser(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    user.username = updateUserDto.username;
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
      return new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }
  public async addRoleUser(username: string, newRole: string) {
    const user = await this.userRepository.findOneBy({ username });
    console.log(user.roles);
    if (!user.roles) {
      user.roles = [];
    }
    if (user.roles.some((role) => role === newRole)) {
      throw new HttpException('Do exist', HttpStatus.BAD_REQUEST);
    }
    user.roles.push(newRole);
    try {
      await this.userRepository.save(user);
      return this.userRepository.findOneBy({ username });
    } catch (error) {
      console.log(error);
      throw new HttpException('', HttpStatus.BAD_REQUEST);
    }
  }
  public async deleteRoleUser(username: string, roleDelete: string) {
    const user = await this.userRepository.findOneBy({ username });
    const role = user.roles.some((role) => role === roleDelete);
    if (!role) throw new HttpException('', HttpStatus.BAD_REQUEST);
    user.roles = user.roles.filter((el) => el !== roleDelete);
    try {
      await this.userRepository.save(user);
      return await this.userRepository.findOneBy({ username });
    } catch (error) {
      console.log(error);
    }
  }
}
