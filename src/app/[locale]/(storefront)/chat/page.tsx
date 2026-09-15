"use client";

import * as React from "react";
import { Send, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useMyConversation, useSendChatMessage, useMarkChatRead } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={cn("flex", message.is_admin ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
          message.is_admin ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        {message.body}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading } = useMyConversation();
  const sendMessage = useSendChatMessage();
  const markRead = useMarkChatRead();
  const [draft, setDraft] = React.useState("");
  const messages = data?.messages ?? [];
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  React.useEffect(() => {
    if ((data?.conversation.customer_unread_count ?? 0) > 0) {
      markRead.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.conversation.customer_unread_count]);

  function handleSend() {
    const body = draft.trim();
    if (!body || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(body);
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-muted-foreground text-sm">Please log in to chat with our support team.</p>
        <Button asChild size="sm">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="bg-primary text-primary-foreground flex items-center gap-3 px-4 py-3">
        <Link href="/" aria-label="Back">
          <ArrowLeft className="size-5" />
        </Link>
        <p className="text-sm font-semibold">Chat with us</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
        {isLoading ? (
          <p className="text-muted-foreground py-8 text-center text-sm">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Send us a message — our team usually replies within a few minutes.
          </p>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      <div className="border-border/60 flex items-end gap-2 border-t p-3">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          rows={1}
          className="max-h-24 min-h-9 resize-none"
        />
        <Button size="icon" onClick={handleSend} disabled={!draft.trim() || sendMessage.isPending}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}