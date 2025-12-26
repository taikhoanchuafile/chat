import z from "zod";
export const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(1),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const signInGGSchema = z.object({
  credential: z.string(),
});
