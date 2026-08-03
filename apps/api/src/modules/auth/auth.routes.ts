import { Router } from "express";
import { validateRequest } from "../../common/validation/validateRequest";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema } from "./auth.schemas";
import { forgotAccountPassword, getMe, loginAccount, logoutAccount, refreshSession, registerAccount, resetAccountPassword, verifyEmailAccount } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", validateRequest({ body: registerSchema }), registerAccount);
authRouter.post("/verify-email", validateRequest({ body: verifyEmailSchema }), verifyEmailAccount);
authRouter.post("/login", validateRequest({ body: loginSchema }), loginAccount);
authRouter.post("/refresh", refreshSession);
authRouter.post("/logout", logoutAccount);
authRouter.post("/forgot-password", validateRequest({ body: forgotPasswordSchema }), forgotAccountPassword);
authRouter.post("/reset-password", validateRequest({ body: resetPasswordSchema }), resetAccountPassword);
authRouter.get("/me", getMe);

export { authRouter };
