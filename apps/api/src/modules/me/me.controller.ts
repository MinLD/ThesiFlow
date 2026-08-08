import type { Request, Response } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { listMyMemberships } from "./me.service";

export async function listMyMembershipsHandler(req: Request, res: Response) {
  const data = await listMyMemberships(req.header("authorization"));
  sendSuccess(res, data);
}
