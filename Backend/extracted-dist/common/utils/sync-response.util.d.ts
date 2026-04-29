type SyncableRecord = {
    updatedAt?: Date | string | null;
    timestamp?: Date | string | null;
};
export declare function buildSyncResponse<T extends SyncableRecord>(data: T[]): {
    data: T[];
    count: number;
    syncedAt: string;
    lastUpdatedAt: string | null;
};
export {};
