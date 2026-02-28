import { z } from "zod";

import {
  generateId,
  getCollection,
  persistCollection,
} from "@/lib/storage/async-storage";
import { parseWithZod } from "@/lib/storage/safe-parse";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import {
  userBaseSchema,
  userResponse,
  updateUserSchema,
  type CreateUserDTO,
  type UpdateUserDTO,
} from "@/lib/validations/user.schema";

const userIdSchema = z.string().trim().min(1, "User id is required");

const createUserInputSchema = userBaseSchema.strict();
const updateUserInputSchema = updateUserSchema.strict();

const storedUserSchema = userBaseSchema
  .extend({
    id: z.string().min(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

const userEntitySchema = userResponse
  .extend({
    id: z.string().min(1),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

type StoredUser = z.infer<typeof storedUserSchema>;
export type UserEntity = z.infer<typeof userEntitySchema>;

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
  const normalizedInput: UpdateUserDTO = {};

  if (typeof input.name === "string") {
    normalizedInput.name = normalizeText(input.name);
  }

  if (typeof input.email === "string") {
    normalizedInput.email = input.email.trim().toLowerCase();
  }

  if (typeof input.phone === "string") {
    normalizedInput.phone = input.phone.trim();
  }

  if (typeof input.password === "string") {
    normalizedInput.password = input.password.trim();
  }

  return normalizedInput;
};

const toUserEntity = (storedUser: StoredUser): UserEntity =>
  parseWithZod(
    userEntitySchema,
    {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      phone: storedUser.phone,
      createdAt: new Date(storedUser.createdAt),
      updatedAt: new Date(storedUser.updatedAt),
    },
    "stored user entity"
  );

export const createUser = async (input: CreateUserDTO): Promise<UserEntity> => {
  const normalizedInput = normalizeCreateUserInput(input);
  const parsedInput = parseWithZod(
    createUserInputSchema,
    normalizedInput,
    "createUser input"
  );

  const now = new Date().toISOString();
  const newUser = parseWithZod(
    storedUserSchema,
    {
      id: generateId("usr"),
      ...parsedInput,
      createdAt: now,
      updatedAt: now,
    },
    "createUser payload"
  );

  await persistCollection(STORAGE_KEYS.users, storedUserSchema, (users) => [
    ...users,
    newUser,
  ]);

  return toUserEntity(newUser);
};

export const listUsers = async (): Promise<UserEntity[]> => {
  const users = await getCollection(STORAGE_KEYS.users, storedUserSchema);
  return users.map(toUserEntity);
};

export const getUserById = async (id: string): Promise<UserEntity | null> => {
  const parsedId = parseWithZod(userIdSchema, id, "getUserById id");
  const users = await getCollection(STORAGE_KEYS.users, storedUserSchema);

  const targetUser = users.find((user) => user.id === parsedId);
  return targetUser ? toUserEntity(targetUser) : null;
};

export const updateUser = async (
  id: string,
  input: UpdateUserDTO
): Promise<UserEntity | null> => {
  const parsedId = parseWithZod(userIdSchema, id, "updateUser id");
  const normalizedInput = normalizeUpdateUserInput(input);
  const parsedInput = parseWithZod(
    updateUserInputSchema,
    normalizedInput,
    "updateUser input"
  );
  const hasUpdates = Object.keys(parsedInput).length > 0;

  let updatedUser: StoredUser | null = null;
  let existingUser: StoredUser | null = null;

  await persistCollection(STORAGE_KEYS.users, storedUserSchema, (users) => {
    const userIndex = users.findIndex((user) => user.id === parsedId);
    if (userIndex < 0) {
      return users;
    }

    existingUser = users[userIndex];

    if (!hasUpdates) {
      return users;
    }

    const mergedUser = parseWithZod(
      storedUserSchema,
      {
        ...users[userIndex],
        ...parsedInput,
        updatedAt: new Date().toISOString(),
      },
      "updateUser payload"
    );

    const nextUsers = [...users];
    nextUsers[userIndex] = mergedUser;
    updatedUser = mergedUser;

    return nextUsers;
  });

  if (updatedUser) {
    return toUserEntity(updatedUser);
  }

  if (existingUser) {
    return toUserEntity(existingUser);
  }

  return null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const parsedId = parseWithZod(userIdSchema, id, "deleteUser id");
  let deleted = false;

  await persistCollection(STORAGE_KEYS.users, storedUserSchema, (users) => {
    const nextUsers = users.filter((user) => user.id !== parsedId);
    deleted = nextUsers.length !== users.length;
    return deleted ? nextUsers : users;
  });

  return deleted;
};
