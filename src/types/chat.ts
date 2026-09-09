export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name?: string;
  is_admin?: boolean;
  body: string;
  created_at: string | null;
}

export interface Conversation {
  id: number;
  status: "open" | "closed";
  customer?: { id: number; name: string; email: string };
  assigned_admin_name?: string | null;
  last_message_at: string | null;
  last_message_preview?: string | null;
  unread_count: number;
  customer_unread_count: number;
  created_at: string | null;
}
