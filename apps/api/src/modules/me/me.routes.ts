import { Router } from "express";
import { listMyMembershipsHandler } from "./me.controller";

export const meRouter = Router();

meRouter.get("/memberships", listMyMembershipsHandler);
