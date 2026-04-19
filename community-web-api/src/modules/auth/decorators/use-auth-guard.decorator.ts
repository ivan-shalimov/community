import { CanActivate, SetMetadata, Type, UseGuards, applyDecorators } from '@nestjs/common';

export const UseAuthGuard = (guard: Type<CanActivate>, metadataKey: string) =>
  applyDecorators(SetMetadata(metadataKey, true), UseGuards(guard));
