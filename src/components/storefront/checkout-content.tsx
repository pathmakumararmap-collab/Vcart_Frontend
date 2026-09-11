"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreditCard, MapPin, Plus, ShoppingBag, Tag, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Currency } from "@/components/shared/currency";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { RequireAuth } from "@/components/shared/require-auth";
import { AddressFormDialog } from "@/components/customer/address-form-dialog";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/hooks/use-cart";
import { useAddresses } from "@/hooks/use-addresses";
import { useCheckout, useCheckoutPaymentMethods } from "@/hooks/use-orders";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validators/checkout";

function CheckoutForm() {
  const t = useTranslations("Checkout");
  const tCommon = useTranslations("Common");
  const tCart = useTranslations("Cart");
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const { data: paymentMethods, isLoading: paymentMethodsLoading } = useCheckoutPaymentMethods();
  const checkout = useCheckout();
  const [addressDialogOpen, setAddressDialogOpen] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_address_id: undefined,
      payment_method_id: undefined,
      coupon_code: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (!form.getValues("shipping_address_id") && addresses?.length) {
      const defaultAddress = addresses.find((address) => address.is_default) ?? addresses[0];
      form.setValue("shipping_address_id", defaultAddress.id);
    }
  }, [addresses, form]);

  React.useEffect(() => {
    if (!form.getValues("payment_method_id") && paymentMethods?.length) {
      const defaultMethod = paymentMethods.find((method) => method.code === "cod") ?? paymentMethods[0];
      form.setValue("payment_method_id", defaultMethod.id);
    }
  }, [paymentMethods, form]);

  if (cartLoading || addressesLoading || paymentMethodsLoading) {
    return <LoadingSpinner className="min-h-[60vh]" />;
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title={tCart("empty")}
          description={t("emptyDescription")}
          action={
            <Button asChild>
              <Link href="/products">{t("browseProducts")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const selectedPaymentMethod = paymentMethods?.find(
    (method) => method.id === form.watch("payment_method_id")
  );

  const onSubmit = (values: CheckoutFormValues) => {
    if (selectedPaymentMethod?.code === "online_gateway") {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast.error(t("fillCardDetails"));
        return;
      }
    }

    checkout.mutate(
      {
        items: items.map((item) => ({
          product_id: item.product!.id,
          product_variant_id: item.variant?.id ?? null,
          quantity: item.quantity,
        })),
        shipping_address_id: values.shipping_address_id,
        billing_address_id: values.shipping_address_id,
        coupon_code: values.coupon_code || undefined,
        payment_method_id: values.payment_method_id,
        notes: values.notes || undefined,
      },
      {
        onSuccess: (order) => {
          router.push(`/dashboard/orders/${order.id}`);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_400px]"
      >
        <div className="space-y-6">
          <h1 className="text-display text-2xl sm:text-3xl">{t("title")}</h1>

          <Card>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                  <MapPin className="text-primary size-4" />
                  {t("shippingAddress")}
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddressDialogOpen(true)}
                >
                  <Plus className="size-3.5" />
                  {t("addNew")}
                </Button>
              </div>

              {!addresses?.length ? (
                <EmptyState
                  title={t("noSavedAddresses")}
                  description={t("addAddressDescription")}
                  className="border-none py-6"
                />
              ) : (
                <FormField
                  control={form.control}
                  name="shipping_address_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(value) => field.onChange(Number(value))}
                          className="gap-3"
                        >
                          {addresses.map((address) => (
                            <Label
                              key={address.id}
                              htmlFor={`address-${address.id}`}
                              className="hover:bg-accent/50 hover-lift-sm flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 p-3.5 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                            >
                              <RadioGroupItem value={String(address.id)} id={`address-${address.id}`} className="mt-0.5" />
                              <span className="text-sm">
                                <span className="block font-medium">
                                  {address.recipient_name}
                                  {address.label && (
                                    <span className="text-muted-foreground font-normal"> · {address.label}</span>
                                  )}
                                </span>
                                <span className="text-muted-foreground block">
                                  {address.address_line1}, {address.city}
                                </span>
                                <span className="text-muted-foreground block">{address.phone}</span>
                              </span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <CreditCard className="text-primary size-4" />
                {t("paymentMethod")}
              </h2>

              {!paymentMethods?.length ? (
                <EmptyState
                  title={t("noPaymentMethods")}
                  description={t("noPaymentMethodsDescription")}
                  className="border-none py-6"
                />
              ) : (
                <FormField
                  control={form.control}
                  name="payment_method_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value ? String(field.value) : undefined}
                          onValueChange={(value) => field.onChange(Number(value))}
                          className="gap-3"
                        >
                          {paymentMethods.map((method) => (
                            <Label
                              key={method.id}
                              htmlFor={`payment-${method.id}`}
                              className="hover:bg-accent/50 hover-lift-sm flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 p-3.5 font-normal has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                            >
                              <RadioGroupItem value={String(method.id)} id={`payment-${method.id}`} />
                              <span className="flex items-center gap-2 text-sm font-medium">
                                {method.code === "cod" ? (
                                  <Wallet className="text-muted-foreground size-4" />
                                ) : (
                                  <CreditCard className="text-muted-foreground size-4" />
                                )}
                                {method.name}
                              </span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedPaymentMethod?.code === "online_gateway" && (
                <div className="border-border/60 space-y-3 rounded-lg border p-4">
                  <p className="text-muted-foreground text-xs">{t("demoPaymentNote")}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="demo-card-number">{t("cardNumber")}</Label>
                      <Input
                        id="demo-card-number"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(event) => setCardNumber(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="demo-card-expiry">{t("expiry")}</Label>
                      <Input
                        id="demo-card-expiry"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(event) => setCardExpiry(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="demo-card-cvv">{t("cvv")}</Label>
                      <Input
                        id="demo-card-cvv"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(event) => setCardCvv(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5">
              <h2 className="font-semibold">{t("orderNotes")}</h2>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder={t("notesPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-5">
            <h2 className="text-eyebrow text-muted-foreground">{t("orderSummary")}</h2>
            <ul className="space-y-2.5 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="text-muted-foreground line-clamp-1">
                    {item.product?.name} × {item.quantity}
                  </span>
                  <Currency value={item.subtotal} className="tabular-nums" />
                </li>
              ))}
            </ul>

            <Separator className="bg-border/60" />

            <FormField
              control={form.control}
              name="coupon_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">
                    <Tag className="size-3.5" />
                    {t("couponCode")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("couponPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-border/60" />

            <div className="flex justify-between font-semibold">
              <span>{tCommon("subtotal")}</span>
              <Currency value={cart?.total ?? 0} className="tabular-nums text-lg" />
            </div>

            <Button
              type="submit"
              size="lg"
              variant="gradient"
              className="w-full"
              disabled={checkout.isPending || !addresses?.length || !paymentMethods?.length}
            >
              {checkout.isPending ? t("placingOrder") : tCommon("placeOrder")}
            </Button>
          </CardContent>
        </Card>
      </form>

      <AddressFormDialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen} />
    </Form>
  );
}

export function CheckoutContent() {
  return (
    <RequireAuth>
      <CheckoutForm />
    </RequireAuth>
  );
}
