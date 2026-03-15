import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.guard';
import { UseAuthGuard } from './use-auth-guard.decorator';

export const IS_JWT_REFRESH_AUTH_USED_KEY = 'isJwtRefreshAuthUsed';
export const UseJwtRefreshAuthGuard = () =>
  UseAuthGuard(JwtRefreshAuthGuard, IS_JWT_REFRESH_AUTH_USED_KEY);
