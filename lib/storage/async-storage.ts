import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

import { parseWithZod } from "./safe-parse";
import type { StorageCollectionKey } from "./storage-keys";

type CollectionUpdater<T> = (collection: T[]) => T[] | Promise<T[]>;

const parseStorageJson = (
  rawCollection: string,
  key: StorageCollectionKey
): unknown => {
  try {
    return JSON.parse(rawCollection);
  } catch {
    throw new Error(`Storage key "${key}" contains invalid JSON data.`);
  }
};

export const generateId = (prefix?: string): string => {
  const randomUuid = globalThis.crypto?.randomUUID?.();
  const fallbackId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;

  const baseId = randomUuid ?? fallbackId;
  return prefix ? `${prefix}_${baseId}` : baseId;
};

export const getCollection = async <T>(
  key: StorageCollectionKey,
  itemSchema: z.ZodType<T>
): Promise<T[]> => {
  const rawCollection = await AsyncStorage.getItem(key);

  if (!rawCollection) {
    return [];
  }

  const parsedJson = parseStorageJson(rawCollection, key);
  return parseWithZod(z.array(itemSchema), parsedJson, `Storage key "${key}"`);
};

export const setCollection = async <T>(
  key: StorageCollectionKey,
  itemSchema: z.ZodType<T>,
  collection: T[]
): Promise<T[]> => {
  const parsedCollection = parseWithZod(
    z.array(itemSchema),
    collection,
    `setCollection("${key}")`
  );

  await AsyncStorage.setItem(key, JSON.stringify(parsedCollection));
  return parsedCollection;
};

export const persistCollection = async <T>(
  key: StorageCollectionKey,
  itemSchema: z.ZodType<T>,
  updater: CollectionUpdater<T>
): Promise<T[]> => {
  const currentCollection = await getCollection(key, itemSchema);
  const updatedCollection = await updater(currentCollection);

  return setCollection(key, itemSchema, updatedCollection);
};
