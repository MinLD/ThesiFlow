import type { Request, Response } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { switchTenantContext } from "./tenant-context.service";

export async function switchTenantContextHandler(req: Request, res: Response) {
  const data = await switchTenantContext(req.header("authorization"), req.body);
  sendSuccess(res, data);
}
