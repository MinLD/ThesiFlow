import type { RequestHandler } from "express";
import { sendSuccess } from "../../common/responses/apiResponse";
import { getHealthStatus, getMetaStatus, getReadinessStatus } from "./health.service";

export const getHealth: RequestHandler = (_req, res) => {
  sendSuccess(res, getHealthStatus());
};

export const getReady: RequestHandler = async (_req, res) => {
  const readiness = await getReadinessStatus();
  sendSuccess(res, readiness, readiness.status === "ready" ? 200 : 503);
};

export const getMeta: RequestHandler = (_req, res) => {
  sendSuccess(res, getMetaStatus());
};
