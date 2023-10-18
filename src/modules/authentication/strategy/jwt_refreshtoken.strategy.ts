import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET_REFRESH_TOKEN } from 'src/configs/config';
import { UserService } from 'src/modules/user/user.service';
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userservice: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretorkey: JWT_SECRET_REFRESH_TOKEN,
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = this.extractTokenFromHeader(request);
    console.log(payload);
    return await this.userservice.getUserIfRefreshTokenMatch(
      refreshToken,
      payload.username,
    );
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}