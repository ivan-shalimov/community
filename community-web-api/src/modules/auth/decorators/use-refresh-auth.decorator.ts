import { SetMetadata } from '@nestjs/common';

export const IS_USE_REFRESH_AUTH_KEY = 'isUseRefreshAuth';
export const UseRefreshAuth = () => SetMetadata(IS_USE_REFRESH_AUTH_KEY, true);
