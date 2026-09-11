"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MailCheck } from "lucide-react";

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
import { useForgotPassword } from "@/hooks/use-auth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators/auth";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth");
  const forgotPassword = useForgotPassword();
  const [sent, setSent] = React.useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword.mutate(values.email, { onSuccess: () => setSent(true) });
  };

  if (sent) {
    return (
      <Card className="glass-panel shadow-luxury-lg">
        <CardHeader>
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
            <MailCheck className="size-5" />
          </div>
          <CardTitle className="text-display mt-3 text-xl">{t("checkYourEmail")}</CardTitle>
          <CardDescription>{t("resetLinkSentDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            <Link href="/login" className="text-primary font-medium hover:underline">
              {t("backToLogin")}
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel shadow-luxury-lg">
      <CardHeader>
        <CardTitle className="text-display text-xl">{t("forgotPasswordHeading")}</CardTitle>
        <CardDescription>{t("forgotPasswordSubtitle")}</CardDescription>
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
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={forgotPassword.isPending}
            >
              {forgotPassword.isPending ? t("sending") : t("sendResetLink")}
            </Button>
          </form>
        </Form>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          {t("rememberedPassword")}{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t("logIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
