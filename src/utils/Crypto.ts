import { randomBytes, scryptSync } from 'crypto';

export function createHashWithSalt(password: string) {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = scryptSync(password, salt, 64).toString('hex');
  return {salt,passwordHash};
}
