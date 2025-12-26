import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpSchema, type SignUpSchema } from "@/schemas/authSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { handleSubmit, reset, control } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signUp = useAuthStore((state) => state.signUp);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const onSubmit = async (data: SignUpSchema) => {
    const { name, email, password } = data;
    await signUp({ name, email, password });
    reset();
    navigate("/signin");
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Tạo tài khoản</CardTitle>
        <CardDescription>
          Nhập thông tin bên dưới để tạo tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="name"
                      type="text"
                      placeholder="John Doe"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-600">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                );
              }}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-600">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                    <FieldDescription>
                      Bạn sẽ dùng email này tương tác với chúng tôi. Chúng tôi
                      sẽ không chia sẽ email của bạn với bất kỳ ai.
                    </FieldDescription>
                  </Field>
                );
              }}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="password"
                      type="password"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-600">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Nhập lại mật khẩu
                    </FieldLabel>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      id="confirm-password"
                      type="password"
                    />
                    {fieldState.error && (
                      <FieldDescription className="text-red-600">
                        {fieldState.error.message}
                      </FieldDescription>
                    )}
                  </Field>
                );
              }}
            />
            <FieldGroup>
              <Field>
                <Button type="submit">Tạo tài khoản</Button>
                <FieldDescription className="px-6 text-center">
                  Nếu đã có tài khoản? <a href="/signin">Đăng nhập</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
