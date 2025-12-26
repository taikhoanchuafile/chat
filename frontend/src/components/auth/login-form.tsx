import { cn } from "@/lib/utils";
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInSchema } from "@/schemas/authSchema";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router";
import SignInGG from "./SignInGG";
import { useEffect } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { handleSubmit, control, reset } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signIn = useAuthStore((state) => state.signIn);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const onSubmit = async (data: SignInSchema) => {
    await signIn(data);
    reset();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập tài khoản</CardTitle>
          <CardDescription>
            Nhập email bên dưới để đăng nhập tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Quên mật khẩu?
                        </a>
                      </div>
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
              <Field>
                <Button type="submit">Đăng nhập</Button>
                {/* login GG */}
                <SignInGG />
                <FieldDescription className="text-center">
                  Nếu chưa có tài khoản? <a href="/signup">Đăng ký</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
