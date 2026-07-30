import { apiGet } from "../../lib/apiClient";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
    correlationId: string;
    timestamp: string;
  };
};

export type HealthStatus = {
  status: "ok";
  service: "api";
  timestamp: string;
};

export function getHealth() {
  return apiGet<ApiSuccessResponse<HealthStatus>>("/health");
}
