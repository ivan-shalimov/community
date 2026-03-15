import { SetMetadata } from '@nestjs/common';

export const IS_USE_LOCAL_AUTH_KEY = 'isUseLocalAuth';
export const UseLocalAuth = () => SetMetadata(IS_USE_LOCAL_AUTH_KEY, true);
