import { LocalAuthGuard } from '../guards/local.guard';
import { UseAuthGuard } from './use-auth-guard.decorator';

export const IS_LOCAL_AUTH_USED_KEY = 'isLocalAuthUsed';
export const UseLocalAuthGuard = () => UseAuthGuard(LocalAuthGuard, IS_LOCAL_AUTH_USED_KEY);
