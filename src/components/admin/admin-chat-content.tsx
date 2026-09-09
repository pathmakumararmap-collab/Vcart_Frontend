"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  useAdminConversations,
  useAdminConversationMessages,
  useSendAdminChatMessage,
  useMarkConversationRead,
  useAdminChatInboxChannel,
} from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import type { ChatMessage, Conversation } from "@/types/chat";

function ConversationRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "hover:bg-muted flex w-full flex-col gap-0.5 border-b px-4 py-3 text-left transition-colors",
        active && "bg-muted"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium">{conversation.customer?.name ?? "Customer"}</p>
        {conversation.unread_count > 0 && (
          <Badge className="bg-primary text-primary-foreground shrink-0">{conversation.unread_count}</Badge>
        )}
      </div>
      <p className="text-muted-foreground truncate text-xs">
        {conversation.last_message_preview ?? "No messages yet"}
      </p>
      {conversation.last_message_at && (
        <p className="text-muted-foreground text-[11px]">
          {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
        </p>
      )}
    </button>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={cn("flex", message.is_admin ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
          message.is_admin ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        )}
      >
        {message.body}
      </div>
    </div>
  );
}

export function AdminChatContent() {
  const [page] = React.useState(1);
  const [selectedId, setSelectedId] = React.useState<number | undefined>();
  const { data: conversationsPage, isLoading: listLoading, refetch: refetchList } = useAdminConversations(page);
  const { data: thread, isLoading: threadLoading } = useAdminConversationMessages(selectedId);
  const sendMessage = useSendAdminChatMessage(selectedId);
  const markRead = useMarkConversationRead(selectedId);
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const messages = thread?.messages ?? [];

  useAdminChatInboxChannel(() => refetchList());

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function handleSelect(conversation: Conversation) {
    setSelectedId(conversation.id);
    markRead.mutate();
  }

  function handleSend() {
    const body = draft.trim();
    if (!body || sendMessage.isPending) return;
    setDraft("");
    sendMessage.mutate(body);
  }

  const conversations = conversationsPage?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Support Chat" description="Live conversations with your customers." />

      <div className="bg-card border-border/60 grid overflow-hidden rounded-2xl border md:grid-cols-[300px_1fr]">
        <div className="border-border/60 max-h-[70vh] overflow-y-auto border-b md:border-r md:border-b-0">
          {listLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <EmptyState icon={MessageCircle} title="No conversations yet" />
          ) : (
            conversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === selectedId}
                onSelect={() => handleSelect(conversation)}
              />
            ))
          )}
        </div>

        <div className="flex h-[70vh] flex-col">
          {!selectedId ? (
            <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
              Select a conversation to view messages
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                {threadLoading ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">Loading…</p>
                ) : (
                  messages.map((message) => <MessageBubble key={message.id} message={message} />)
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
                  placeholder="Type a reply…"
                  rows={1}
                  className="max-h-24 min-h-9 resize-none"
                />
                <Button size="icon" onClick={handleSend} disabled={!draft.trim() || sendMessage.isPending}>
                  <Send className="size-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}