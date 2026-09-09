import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminChatService, customerChatService } from "@/lib/api/services/chat.service";
import { queryKeys } from "@/lib/query-keys";
import { getEcho } from "@/lib/echo";
import { useAuthStore } from "@/store/auth-store";
import type { ChatMessage } from "@/types/chat";

type ThreadData = { conversation: { id: number }; messages: ChatMessage[] };

function appendMessageIfNew<T extends ThreadData>(old: T | undefined, message: ChatMessage): T | undefined {
  if (!old) return old;
  if (old.messages.some((m) => m.id === message.id)) return old;
  return { ...old, messages: [...old.messages, message] };
}

/**
 * Subscribes to a conversation's private channel and writes every new
 * message straight into the given query cache entry — this is the ONLY
 * place messages get added after the initial load, so there is one
 * source of truth (the query cache) instead of local state that could
 * race against it.
 */
function useChatChannelSync(conversationId: number | undefined, queryKey: readonly unknown[]) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!conversationId) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`conversation.${conversationId}`);
    channel.listen(".message.sent", (payload: { message: ChatMessage }) => {
      queryClient.setQueryData(queryKey, (old: ThreadData | undefined) =>
        appendMessageIfNew(old, payload.message)
      );
    });

    return () => {
      echo.leave(`conversation.${conversationId}`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, queryClient]);
}

/** Admin-only: fires whenever any customer sends a new message anywhere. */
export function useAdminChatInboxChannel(onNewMessage: () => void) {
  const callbackRef = React.useRef(onNewMessage);
  callbackRef.current = onNewMessage;

  React.useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private("admin.chat-inbox");
    channel.listen(".message.sent", () => callbackRef.current());

    return () => {
      echo.leave("admin.chat-inbox");
    };
  }, []);
}

// ── Customer ──────────────────────────────────────────────────────────

export function useMyConversation() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: queryKeys.chat.mine,
    queryFn: () => customerChatService.show(),
    staleTime: 30 * 1000,
    enabled: isAuthenticated,
  });

  useChatChannelSync(query.data?.conversation.id, queryKeys.chat.mine);

  return query;
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => customerChatService.sendMessage(body),
    onSuccess: (message) => {
      queryClient.setQueryData(queryKeys.chat.mine, (old: ThreadData | undefined) =>
        appendMessageIfNew(old, message)
      );
    },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────

export function useAdminConversations(page = 1) {
  return useQuery({
    queryKey: queryKeys.chat.adminConversations(page),
    queryFn: () => adminChatService.list(page),
    staleTime: 15 * 1000,
  });
}

export function useAdminConversationMessages(conversationId: number | undefined) {
  const query = useQuery({
    queryKey: queryKeys.chat.adminMessages(conversationId ?? 0),
    queryFn: () => adminChatService.messages(conversationId as number),
    enabled: !!conversationId,
    staleTime: 0,
    refetchOnMount: "always",
  });

  useChatChannelSync(conversationId, queryKeys.chat.adminMessages(conversationId ?? 0));

  return query;
}

export function useSendAdminChatMessage(conversationId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => adminChatService.sendMessage(conversationId as number, body),
    onSuccess: (message) => {
      if (!conversationId) return;
      queryClient.setQueryData(queryKeys.chat.adminMessages(conversationId), (old: ThreadData | undefined) =>
        appendMessageIfNew(old, message)
      );
      queryClient.invalidateQueries({ queryKey: ["chat", "admin", "conversations"] });
    },
  });
}

export function useMarkConversationRead(conversationId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminChatService.markRead(conversationId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", "admin", "conversations"] });
    },
  });
}