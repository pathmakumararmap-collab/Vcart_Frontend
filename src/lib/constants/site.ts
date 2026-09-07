export const siteConfig = {
  name: "Vcart",
  fullName: "Vcart Online Shopping",
  description:
    "Shop electronics, groceries, fashion, home & living, and beauty products across Sri Lanka. Fast delivery, secure checkout, and in-store pickup.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    facebook: "https://facebook.com/royalsl",
    instagram: "https://instagram.com/royalsl",
    twitter: "https://twitter.com/royalsl",
  },
  contact: {
    email: "support@vcart.example",
    phone: "+94 57 22 35168",
    address: "Galahitiyawa Rd,Gaswaththa,Bandarawela, Sri Lanka",
  },
} as const;

export const CURRENCY = "LKR";
export const CURRENCY_LOCALE = "en-LK";
