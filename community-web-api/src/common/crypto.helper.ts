import { randomBytes } from 'crypto';

export class CryptoHelper {
  static generateRandomToken(length: number = 64): string {
    return randomBytes(length).toString('base64url');
  }
}
