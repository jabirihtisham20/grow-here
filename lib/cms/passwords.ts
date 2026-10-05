import 'server-only';
import { randomBytes } from 'node:crypto';
import { compare, hash } from 'bcryptjs';

export const BCRYPT_ROUNDS = 12;
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_BYTES = 72;

export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) return 'Password is too long. Use at most 72 UTF-8 bytes.';
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}

let dummyHashPromise: Promise<string> | undefined;
export function getDummyPasswordHash(): Promise<string> {
  dummyHashPromise ??= hashPassword(randomBytes(32).toString('base64url'));
  return dummyHashPromise;
}
