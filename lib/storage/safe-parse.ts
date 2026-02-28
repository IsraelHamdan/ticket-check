import { z } from "zod";

const toPathLabel = (path: (string | number | symbol)[]): string => {
  if (path.length === 0) {
    return "<root>";
  }

  return path.map((segment) => String(segment)).join(".");
};

export const parseWithZod = <T>(
  schema: z.ZodType<T>,
  value: unknown,
  context: string
): T => {
  const parsedValue = schema.safeParse(value);

  if (parsedValue.success) {
    return parsedValue.data;
  }

  const issues = parsedValue.error.issues
    .map((issue) => `${toPathLabel(issue.path)}: ${issue.message}`)
    .join("; ");

  throw new Error(`${context} validation failed: ${issues}`);
};
