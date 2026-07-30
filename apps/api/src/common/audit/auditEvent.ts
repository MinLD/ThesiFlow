export type AuditEvent = Readonly<{
  action: string;
  requestId: string;
  correlationId: string;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}>;

export function createAuditEvent(event: AuditEvent): AuditEvent {
  return Object.freeze(event.metadata ? { ...event, metadata: Object.freeze({ ...event.metadata }) } : { ...event });
}
