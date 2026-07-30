type OutboxTransaction = {
  outboxEvent: {
    create(args: {
      data: {
        eventType: string;
        aggregateType?: string;
        aggregateId?: string;
        payload: unknown;
        availableAt?: Date;
      };
    }): Promise<unknown>;
  };
};

export function enqueueOutboxEvent(
  tx: OutboxTransaction,
  event: {
    eventType: string;
    aggregateType?: string;
    aggregateId?: string;
    payload: unknown;
    availableAt?: Date;
  }
) {
  const data: {
    eventType: string;
    aggregateType?: string;
    aggregateId?: string;
    payload: unknown;
    availableAt?: Date;
  } = {
    eventType: event.eventType,
    payload: event.payload
  };

  if (event.aggregateType) data.aggregateType = event.aggregateType;
  if (event.aggregateId) data.aggregateId = event.aggregateId;
  if (event.availableAt) data.availableAt = event.availableAt;

  return tx.outboxEvent.create({
    data
  });
}
