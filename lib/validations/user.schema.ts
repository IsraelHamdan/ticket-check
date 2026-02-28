import { z } from "zod";
import { emailRegex, errorMessages, phoneRegex } from "./regex";

export const userBaseSchema = z.object({
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

export type CreateUserDTO = z.infer<typeof userBaseSchema>;

export const updateUserSchema = userBaseSchema.partial();
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export const loginUserSchema = z.object({
  email: z.email().refine((val) => emailRegex.test(val), {
    message: errorMessages.email,
  }),
  password: z.string().min(6).max(12),
});

export type LoginUserDTO = z.infer<typeof loginUserSchema>;

export const userResponse = userBaseSchema.omit({
  password: true,
});

export type UserResponseDTO = z.infer<typeof userResponse>;
