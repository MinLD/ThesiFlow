import { AppError } from "../errors/AppError";
import { prisma } from "../../database/prisma";
import { verifyAccessToken } from "./token";

export type AuthenticatedAccount = {
  id: string;
  email: string;
};

export async function requireActiveAccount(authorization: string | undefined): Promise<AuthenticatedAccount> {
  const accessToken = parseBearerToken(authorization);
  if (!accessToken) {
    throw new AppError(401, "AUTH_REQUIRED", "Authentication required");
  }

  try {
    const payload = verifyAccessToken(accessToken);
    const account = await prisma.account.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true },
    });
    if (!account || account.status !== "active") {
      throw new AppError(401, "AUTH_REQUIRED", "Authentication required");
    }
    return { id: account.id, email: account.email };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(401, "AUTH_REQUIRED", "Authentication required");
  }
}

function parseBearerToken(authorization: string | undefined): string | null {
  const [scheme, token] = authorization?.split(" ") ?? [];
  return scheme === "Bearer" && token ? token : null;
}
