"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth-store";
import { useMyConversation, useSendChatMessage } from "@/hooks/use-chat";
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

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useMyConversation();
  const sendMessage = useSendChatMessage();
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const messages = data?.messages ?? [];

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

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open ? (
        isAuthenticated ? (
          <ChatPanel onClose={() => setOpen(false)} />
        ) : (
          <LoggedOutPanel onClose={() => setOpen(false)} />
        )
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-primary text-primary-foreground shadow-luxury-lg hover-lift-sm flex size-14 items-center justify-center rounded-full"
          aria-label="Open chat"
        >
          <MessageCircle className="size-6" />
        </button>
      )}
    </div>
  );
}