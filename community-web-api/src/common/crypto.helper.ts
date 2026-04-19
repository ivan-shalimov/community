import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export class CryptoHelper {
  static generateRandomToken(length: number = 64): string {
    return randomBytes(length).toString('base64url');
  }

  static async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const saltRounds = 10; // The "cost factor"

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return { hash, salt };
  }

  static async verifyPassword(hash: string, password: string): Promise<boolean> {
    // It knows how to extract the salt from the hash to verify
    return await bcrypt.compare(password, hash);
  }
}
