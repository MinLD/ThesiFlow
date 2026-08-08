import type { Request, Response } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { acceptInvitation, activateOrganization, createInvitation, createOrganization } from "./organization.service";

export async function createOrganizationHandler(req: Request, res: Response) {
  const data = await createOrganization(req.header("authorization"), req.body);
  sendSuccess(res, data, 201);
}

export async function activateOrganizationHandler(req: Request, res: Response) {
  const data = await activateOrganization(req.header("authorization"), String(req.params.organizationId));
  sendSuccess(res, data);
}

export async function createInvitationHandler(req: Request, res: Response) {
  const data = await createInvitation(req.header("authorization"), String(req.params.organizationId), req.body);
  sendSuccess(res, data, 201);
}

export async function acceptInvitationHandler(req: Request, res: Response) {
  const data = await acceptInvitation(req.header("authorization"), req.body);
  sendSuccess(res, data);
}
