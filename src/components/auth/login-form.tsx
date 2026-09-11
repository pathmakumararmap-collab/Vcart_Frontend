"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "@/i18n/navigation";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";

export function LoginForm() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? undefined;
  const login = useLogin(redirect);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values);
  };

  return (
    <Card className="glass-panel shadow-luxury-lg">
      <CardHeader>
        <CardTitle className="text-display text-xl">{t("welcomeBack")}</CardTitle>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t("emailPlaceholder")} autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("password")}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="gradient" className="w-full" disabled={login.isPending}>
              {login.isPending ? t("loggingIn") : t("logIn")}
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
