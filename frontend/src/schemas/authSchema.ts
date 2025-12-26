import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Họ và tên không được để trống"),
    email: z.email("Email không hợp lệ"),
    password: z
      .string()
      .trim()
      .min(6, "Mật khẩu có ít nhất 6 ký tự")
      .max(50, "Mát khẩu quá dài"),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khóp",
    path: ["confirmPassword"],
  });
export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z
    .string()
    .trim()
    .min(6, "Mật khẩu có ít nhất 6 ký tự")
    .max(50, "Mát khẩu quá dài"),
});
export type SignInSchema = z.infer<typeof signInSchema>;
