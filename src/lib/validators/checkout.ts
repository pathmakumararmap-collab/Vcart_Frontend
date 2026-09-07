import { z } from "zod";

export const checkoutSchema = z.object({
  shipping_address_id: z.number().positive().optional(),
  billing_address_id: z.number().positive().optional(),
  customer_name: z.string().optional().or(z.literal("")),
  customer_phone: z.string().optional().or(z.literal("")),
  customer_email: z.email().optional().or(z.literal("")),
  coupon_code: z.string().optional().or(z.literal("")),
  payment_method_id: z.number({ error: "Please select a payment method." }).positive(),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
