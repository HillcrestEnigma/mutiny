import { generateIdFromEntropySize } from "lucia";
import * as argon2 from "@node-rs/argon2";

export const generateUserId = () => generateIdFromEntropySize(10);

export const hashPassword = async (password: string) => {
  return await argon2.hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
};

export const verifyPassword = async (hash: string, password: string) => {
  return await argon2.verify(hash, password);
};
