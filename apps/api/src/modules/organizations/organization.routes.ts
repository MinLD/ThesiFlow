import { Router } from "express";
import { validateRequest } from "../../common/validation/validateRequest";
import { acceptInvitationHandler, activateOrganizationHandler, createInvitationHandler, createOrganizationHandler } from "./organization.controller";
import { acceptInvitationSchema, createInvitationSchema, createOrganizationSchema, organizationParamsSchema } from "./organization.schemas";

export const organizationRouter = Router();
export const membershipInvitationRouter = Router();

organizationRouter.post("/", validateRequest({ body: createOrganizationSchema }), createOrganizationHandler);

organizationRouter.post(
  "/:organizationId/activate",
  validateRequest({ params: organizationParamsSchema }),
  activateOrganizationHandler,
);

organizationRouter.post(
  "/:organizationId/invitations",
  validateRequest({ params: organizationParamsSchema, body: createInvitationSchema }),
  createInvitationHandler,
);

membershipInvitationRouter.post("/accept", validateRequest({ body: acceptInvitationSchema }), acceptInvitationHandler);
