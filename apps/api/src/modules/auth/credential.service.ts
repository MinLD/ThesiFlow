import { AppError } from "../../common/errors/AppError";
import { hashPassword, verifyPassword } from "../../common/auth/password";

const MIN_PASSWORD_LENGTH = 12;

function assertPasswordPolicy(password: string): void {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, "WEAK_PASSWORD", "Password must be at least 12 characters");
  }
}

async function hashAccountPassword(password: string): Promise<string> {
  assertPasswordPolicy(password);
  return hashPassword(password);
}

async function verifyAccountPassword(passwordHash: string, password: string): Promise<boolean> {
  if (!passwordHash || !password) {
    return false;
  }

  try {
    return await verifyPassword(passwordHash, password);
  } catch {
    return false;
  }
}

export { assertPasswordPolicy, hashAccountPassword, verifyAccountPassword };
