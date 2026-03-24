import * as common from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { Observe } from '../../../metrics/observe.decorator';
import { IS_PUBLIC_API_KEY } from '../decorators/public-api.decorator';
import { IS_JWT_REFRESH_AUTH_USED_KEY } from '../decorators/use-jwt-refresh-auth.decorator';
import { IS_LOCAL_AUTH_USED_KEY } from '../decorators/use-local-auth.decorator';

@common.Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  @Observe('jwt_auth_guard')
  canActivate(context: common.ExecutionContext) {
    const targets = [context.getHandler(), context.getClass()];

    // because jwt strategy is registered globally we need to explicitly check
    // if the route is marked as public or local auth or refresh auth, if so we skip jwt auth guard
    const skipJwt =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_API_KEY, targets) ||
      this.reflector.getAllAndOverride<boolean>(IS_LOCAL_AUTH_USED_KEY, targets) ||
      this.reflector.getAllAndOverride<boolean>(IS_JWT_REFRESH_AUTH_USED_KEY, targets);

    if (skipJwt) {
      return true;
    }

    return super.canActivate(context);
  }
}
