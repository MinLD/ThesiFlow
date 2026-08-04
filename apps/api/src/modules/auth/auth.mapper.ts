import type { AccountDto, AuthResponseDto, SafeSessionDto } from "./auth.dto";

type AccountLike = {
  id: string;
  email: string;
  fullName: string;
  status: string;
};

type SessionLike = {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  reusedAt: Date | null;
  userAgent: string | null;
  ipAddress: string | null;
};

function toAccountDto(account: AccountLike): AccountDto {
  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    status: account.status,
  };
}

function toAuthResponseDto(input: { account: AccountDto; accessToken: string }): AuthResponseDto {
  return {
    account: input.account,
    accessToken: input.accessToken,
  };
}

function maskIpAddress(ipAddress: string | null): string | null {
  if (!ipAddress) {
    return null;
  }

  if (ipAddress.includes(".")) {
    return ipAddress.replace(/\.\d+$/, ".0");
  }

  return ipAddress.replace(/:[^:]+$/, ":****");
}

function toSafeSessionDto(session: SessionLike, currentSessionId: string): SafeSessionDto {
  return {
    ...session,
    ipAddress: maskIpAddress(session.ipAddress),
    current: session.id === currentSessionId,
  };
}

export { maskIpAddress, toAccountDto, toAuthResponseDto, toSafeSessionDto };
