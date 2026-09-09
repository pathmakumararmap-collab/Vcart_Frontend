"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

function ChatPanel({ messages, isLoading, onClose }: { messages: ChatMessage[]; isLoading: boolean; onClose: () => void }) {
  const sendMessage = useSendChatMessage();
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function handleSend() {
    const body = draft.trim();
    if (!body || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(body);
  }

  return (
    <div className="bg-card border-border/60 shadow-luxury-xl flex h-[480px] w-[340px] flex-col overflow-hidden rounded-2xl border sm:w-[380px]">
      <div className="bg-primary text-primary-foreground flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold">Chat with us</p>
        <button type="button" onClick={onClose} className="hover:opacity-80" aria-label="Close chat">
          <X className="size-4" />
        </button>
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

function LoggedOutPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-card border-border/60 shadow-luxury-xl flex w-[320px] flex-col overflow-hidden rounded-2xl border">
      <div className="bg-primary text-primary-foreground flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold">Chat with us</p>
        <button type="button" onClick={onClose} className="hover:opacity-80" aria-label="Close chat">
          <X className="size-4" />
        </button>
      </div>
      <div className="space-y-3 p-5 text-center">
        <p className="text-muted-foreground text-sm">Please log in to chat with our support team.</p>
        <Button asChild size="sm">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetching + the real-time subscription live here, at the top of the
  // widget, so they stay active for as long as the page is open — not
  // just while the panel happens to be expanded. That's what lets a
  // reply arrive (and the unread dot appear) while the bubble is closed.
  const { data, isLoading } = useMyConversation();
  const markRead = useMarkChatRead();
  const messages = data?.messages ?? [];

  // Server-persisted, not client session state — so a page refresh
  // doesn't lose track of what's actually been read.
  const hasUnread = !open && (data?.conversation.customer_unread_count ?? 0) > 0;

  function handleOpen() {
    setOpen(true);
    if ((data?.conversation.customer_unread_count ?? 0) > 0) {
      markRead.mutate();
    }
  }

  // If a new message arrives while the panel is already open, immediately
  // mark it read again — otherwise the badge would reappear once closed,
  // even though the customer was actively watching it come in.
  const prevMessageCountRef = React.useRef(messages.length);
  React.useEffect(() => {
    if (open && messages.length !== prevMessageCountRef.current) {
      markRead.mutate();
    }
    prevMessageCountRef.current = messages.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, messages.length]);

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open ? (
        isAuthenticated ? (
          <ChatPanel messages={messages} isLoading={isLoading} onClose={() => setOpen(false)} />
        ) : (
          <LoggedOutPanel onClose={() => setOpen(false)} />
        )
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="bg-primary text-primary-foreground shadow-luxury-lg hover-lift-sm relative flex size-14 items-center justify-center rounded-full"
          aria-label="Open chat"
        >
          <MessageCircle className="size-6" />
          {hasUnread && (
            <span className="absolute top-0 right-0 size-3.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>
      )}
    </div>
  );
}
