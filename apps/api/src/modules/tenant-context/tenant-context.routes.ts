import { Router } from "express";
import { validateRequest } from "../../common/validation/validateRequest";
import { switchTenantContextHandler } from "./tenant-context.controller";
import { switchTenantContextSchema } from "./tenant-context.schemas";

export const tenantContextRouter = Router();

tenantContextRouter.post("/switch", validateRequest({ body: switchTenantContextSchema }), switchTenantContextHandler);
