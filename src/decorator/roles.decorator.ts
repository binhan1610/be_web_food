import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { Role } from 'src/Enum/role.enum';
import { AuthorizeGuard } from 'src/guard/authorize.guard';
import JwtAuthenticationGuard from 'src/guard/jwt-authentication.guard';

export const ROLES_KEY = 'roles';
export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthenticationGuard, AuthorizeGuard),
  );
};
