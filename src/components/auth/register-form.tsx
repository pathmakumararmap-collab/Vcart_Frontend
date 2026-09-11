"use client";

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
import { useRegister } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const register = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", password_confirmation: "" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    register.mutate(values);
  };

  return (
    <Card className="glass-panel shadow-luxury-lg">
      <CardHeader>
        <CardTitle className="text-display text-xl">{t("createAccountHeading")}</CardTitle>
        <CardDescription>{t("registerSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fullNamePlaceholder")} autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneOptional")}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="077 123 4567" autoComplete="tel" {...field} />
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
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("confirmPasswordPlaceholder")}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="gradient" className="w-full" disabled={register.isPending}>
              {register.isPending ? t("creatingAccount") : t("createAccountButton")}
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
