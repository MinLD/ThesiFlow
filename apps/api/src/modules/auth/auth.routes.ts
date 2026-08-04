import { Router } from "express";
import {
  forgotPasswordRateLimit,
  loginRateLimit,
  refreshRateLimit,
  requireTrustedOrigin,
  resetPasswordRateLimit,
  verifyEmailRateLimit,
} from "../../common/middleware/security";
import { validateRequest } from "../../common/validation/validateRequest";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./auth.schemas";
import {
  forgotAccountPassword,
  getMe,
  getSessions,
  loginAccount,
  logoutAccount,
  logoutAllSessions,
  refreshSession,
  registerAccount,
  resetAccountPassword,
  revokeSession,
  verifyEmailAccount,
} from "./auth.controller";

const authRouter = Router();


authRouter.post("/register", validateRequest({ body: registerSchema }), registerAccount);
authRouter.post("/verify-email", verifyEmailRateLimit, validateRequest({ body: verifyEmailSchema }), verifyEmailAccount);
authRouter.post("/login", loginRateLimit, validateRequest({ body: loginSchema }), loginAccount);
authRouter.post("/refresh", refreshRateLimit, requireTrustedOrigin, refreshSession);
authRouter.post("/logout", requireTrustedOrigin, logoutAccount);
authRouter.post("/forgot-password", forgotPasswordRateLimit, validateRequest({ body: forgotPasswordSchema }), forgotAccountPassword);
authRouter.post("/reset-password", resetPasswordRateLimit, validateRequest({ body: resetPasswordSchema }), resetAccountPassword);
authRouter.get("/me", getMe);
authRouter.get("/sessions", getSessions);
authRouter.delete("/sessions/:sessionId", requireTrustedOrigin, revokeSession);
authRouter.post("/logout-all", requireTrustedOrigin, logoutAllSessions);

export { authRouter };
