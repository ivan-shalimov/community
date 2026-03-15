import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_API_KEY } from '../decorators/public-api.decorator';
import { IS_USE_LOCAL_AUTH_KEY } from '../decorators/use-local-auth.decorator';
import { IS_USE_REFRESH_AUTH_KEY } from '../decorators/use-refresh-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const targets = [context.getHandler(), context.getClass()];

    // because jwt strategy is registered globally we need to explicitly check
    // if the route is marked as public or local auth or refresh auth, if so we skip jwt auth guard
    const skipJwt =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_API_KEY, targets) ||
      this.reflector.getAllAndOverride<boolean>(IS_USE_LOCAL_AUTH_KEY, targets) ||
      this.reflector.getAllAndOverride<boolean>(IS_USE_REFRESH_AUTH_KEY, targets);

    if (skipJwt) {
      return true;
    }

    return super.canActivate(context);
  }
}
