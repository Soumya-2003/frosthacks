import { randomInt } from 'crypto'

export const generateVerifyCode = (): string => {
    return randomInt(100000, 999999).toString();
  };