import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function createHashWithSalt(password: string) {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = scryptSync(password, salt, 64).toString('hex');
  return {salt,passwordHash};
}

export function Authentication(password,salt,passwordHash){
       const testeHash = scryptSync(password, salt, 64);
      const realPassword = Buffer.from(passwordHash, "hex");
      const matchPassword = timingSafeEqual(testeHash, realPassword);

      return matchPassword
}