import { z } from "zod/v4";

import {
  generateId,
  getCollection,
  persistCollection,
} from "@/lib/storage/async-storage";
import { parseWithZod } from "@/lib/storage/safe-parse";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  userBaseSchema,
  userEntitySchema,
  type CreateUserDTO,
  type LoginUserDTO,
  type UpdateUserDTO,
  type UserEntity,
} from "@/lib/validations/user.schema";

const userIdSchema = z.string().trim().min(1, "User id is required");

const storedUserSchema = userBaseSchema
  .extend({
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();

type StoredUser = z.infer<typeof storedUserSchema>;

const normalizeText = (value: string): string =>
  value.trim().replace(/\s+/g, " ");

const normalizeCreateUserInput = (input: CreateUserDTO): CreateUserDTO => ({
  ...input,
  name: normalizeText(input.name),
  email: input.email.trim().toLowerCase(),
  phone: input.phone.trim(),
  password: input.password.trim(),
});

const normalizeUpdateUserInput = (input: UpdateUserDTO): UpdateUserDTO => {
  const out: UpdateUserDTO = {};
  if (typeof input.name === "string") out.name = normalizeText(input.name);
  if (typeof input.email === "string")
    out.email = input.email.trim().toLowerCase();
  if (typeof input.phone === "string") out.phone = input.phone.trim();
  if (typeof input.password === "string") out.password = input.password.trim();
  return out;
};

const normalizeLoginUserInput = (input: LoginUserDTO): LoginUserDTO => ({
  email: input.email.trim().toLowerCase(),
  password: input.password.trim(),
});

const toUserEntity = (stored: StoredUser): UserEntity =>
  parseWithZod(
    userEntitySchema,
    {
      id: stored.id,
      name: stored.name,
      email: stored.email,
      phone: stored.phone,
      createdAt: new Date(stored.createdAt),
      updatedAt: new Date(stored.updatedAt),
    },
    "toUserEntity",
  );

// ── Operações ─────────────────────────────────────────────────────────────────

export const createUser = async (input: CreateUserDTO): Promise<UserEntity> => {
  const normalized = normalizeCreateUserInput(input);
  const parsed = parseWithZod(createUserSchema, normalized, "createUser input");

  let createdUser: StoredUser | null = null;

  await persistCollection(STORAGE_KEYS.users, storedUserSchema, (users) => {
    if (users.some((u) => u.email === parsed.email)) {
      throw new Error("createUser failed: email already in use.");
    }

    const now = new Date().toISOString();
    const nextUser = parseWithZod(
      storedUserSchema,
      {
        id: generateId("usr"),
        ...parsed,
        createdAt: now,
        updatedAt: now,
      },
      "createUser payload",
    );

    createdUser = nextUser;
    return [...users, nextUser];
  });

  if (!createdUser) throw new Error("createUser failed: user was not created.");
  return toUserEntity(createdUser);
};

export const listUsers = async (): Promise<UserEntity[]> => {
  const users = await getCollection(STORAGE_KEYS.users, storedUserSchema);
  return users.map(toUserEntity);
};

export const getUserById = async (id: string): Promise<UserEntity | null> => {
  const parsedId = parseWithZod(userIdSchema, id, "getUserById id");
  const users = await getCollection(STORAGE_KEYS.users, storedUserSchema);
  const found = users.find((u) => u.id === parsedId);
  return found ? toUserEntity(found) : null;
};

export const updateUser = async (
  id: string,
  input: UpdateUserDTO,
): Promise<UserEntity | null> => {
  const parsedId = parseWithZod(userIdSchema, id, "updateUser id");
  const normalized = normalizeUpdateUserInput(input);
  const parsed = parseWithZod(updateUserSchema, normalized, "updateUser input");
  const hasUpdates = Object.keys(parsed).length > 0;

  let updatedUser: StoredUser | null = null;
  let existingUser: StoredUser | null = null;

  await persistCollection(STORAGE_KEYS.users, storedUserSchema, (users) => {
    const idx = users.findIndex((u) => u.id === parsedId);
    if (idx < 0) return users;

    existingUser = users[idx];
    if (!hasUpdates) return users;

    const merged = parseWithZod(
      storedUserSchema,
      { ...users[idx], ...parsed, updatedAt: new Date().toISOString() },
      "updateUser payload",
    );

    const next = [...users];
    next[idx] = merged;
    updatedUser = merged;
    return next;
  });

  if (updatedUser) return toUserEntity(updatedUser);
  if (existingUser) return toUserEntity(existingUser);
  return null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const parsedId = parseWithZod(userIdSchema, id, "deleteUser id");
  let deleted = false;

  await persistCollection(STORAGE_KEYS.users, storedUserSchema, (users) => {
    const next = users.filter((u) => u.id !== parsedId);
    deleted = next.length !== users.length;
    return deleted ? next : users;
  });

  return deleted;
};

export const loginUser = async (
  input: LoginUserDTO,
): Promise<UserEntity | null> => {
  const normalized = normalizeLoginUserInput(input);
  const parsed = parseWithZod(loginUserSchema, normalized, "loginUser input");
  const users = await getCollection(STORAGE_KEYS.users, storedUserSchema);

  const matched = users.find((u) => u.email === parsed.email);
  if (!matched || matched.password !== parsed.password) return null;

  return toUserEntity(matched);
};
