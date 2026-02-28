export const STORAGE_KEYS = {
  users: "@ticket-check/users",
  tickets: "@ticket-check/tickets",
} as const;

export type StorageCollectionKey =
  (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
