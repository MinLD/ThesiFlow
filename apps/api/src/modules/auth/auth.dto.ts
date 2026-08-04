type AccountDto = {
  id: string;
  email: string;
  fullName: string;
  status: string;
};

type AuthResponseDto = {
  account: AccountDto;
  accessToken: string;
};

type AuthTokenResultDto = AuthResponseDto & {
  refreshToken: string;
  sessionId: string;
};

type RegisterResponseDto = {
  account: AccountDto;
  verificationToken?: string;
};

type TokenRequestResponseDto = {
  requested: true;
  resetToken?: string;
};

type SafeSessionDto = {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  reusedAt: Date | null;
  userAgent: string | null;
  ipAddress: string | null;
  current: boolean;
};

export type {
  AccountDto,
  AuthResponseDto,
  AuthTokenResultDto,
  RegisterResponseDto,
  SafeSessionDto,
  TokenRequestResponseDto,
};
