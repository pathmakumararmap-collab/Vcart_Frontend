import type { Metadata } from "next";

import { AdminChatContent } from "@/components/admin/admin-chat-content";

export const metadata: Metadata = {
  title: "Support Chat",
  description: "Live chat conversations with customers.",
  robots: { index: false, follow: false },
};

export default function AdminChatPage() {
  return <AdminChatContent />;
}
