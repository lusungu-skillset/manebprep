type SyncableRecord = {
  updatedAt?: Date | string | null;
  timestamp?: Date | string | null;
};

function getComparableValue(value?: Date | string | null): number {
  if (!value) {
    return 0;
  }

  return new Date(value).getTime();
}

export function buildSyncResponse<T extends SyncableRecord>(data: T[]) {
  const lastUpdatedAt = data.reduce<string | null>((latest, item) => {
    const currentValue = item.updatedAt ?? item.timestamp ?? null;

    if (!currentValue) {
      return latest;
    }

    if (!latest) {
      return new Date(currentValue).toISOString();
    }

    return getComparableValue(currentValue) > getComparableValue(latest)
      ? new Date(currentValue).toISOString()
      : latest;
  }, null);

  return {
    data,
    count: data.length,
    syncedAt: new Date().toISOString(),
    lastUpdatedAt,
  };
}
