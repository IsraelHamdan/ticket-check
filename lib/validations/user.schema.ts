import { z } from "zod/v4";
import { emailRegex, errorMessages, phoneRegex } from "./regex";

export const userBaseSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(3, { message: "O nome de usuário deve ter no mínimo 3 caracteres" }),
  email: z.email().refine((val) => emailRegex.test(val), {
    message: errorMessages.email,
  }),
  phone: z.string().refine((val) => phoneRegex.test(val), {
    message: errorMessages.telefone,
  }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracacteres" })
    .max(12, { message: "A senha deve ter no máximo 12 caracacteres" }),
});

export const createUserSchema = userBaseSchema.omit({ id: true });
export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export const loginUserSchema = z.object({
  email: z.email().refine((val) => emailRegex.test(val), {
    message: errorMessages.email,
  }),
  password: z.string().min(6).max(12),
});

export type LoginUserDTO = z.infer<typeof loginUserSchema>;

export const userEntitySchema = userBaseSchema.omit({ password: true }).extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserEntity = z.infer<typeof userEntitySchema>;

// Mantido para compatibilidade, aponta para userEntitySchema
export const userResponse = userEntitySchema;
export type UserResponseDTO = UserEntity;
