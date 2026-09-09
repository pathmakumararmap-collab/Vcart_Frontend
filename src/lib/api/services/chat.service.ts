import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants/api";
import type { ApiResource, PaginatedResponse } from "@/types/common";
import type { ChatMessage, Conversation } from "@/types/chat";

export const customerChatService = {
  async show(): Promise<{ conversation: Conversation; messages: ChatMessage[] }> {
    const { data } = await apiClient.get<
      ApiResource<{ conversation: Conversation; messages: ChatMessage[] }>
    >(API_ENDPOINTS.customer.chat);
    return data.data;
  },

  async sendMessage(body: string): Promise<ChatMessage> {
    const { data } = await apiClient.post<ApiResource<ChatMessage>>(
      API_ENDPOINTS.customer.chatMessages,
      { body }
    );
    return data.data;
  },
};

export const adminChatService = {
  async list(page = 1): Promise<PaginatedResponse<Conversation>> {
    const { data } = await apiClient.get<PaginatedResponse<Conversation>>(
      API_ENDPOINTS.admin.chatConversations,
      { params: { page } }
    );
    return data;
  },

  async messages(
    conversationId: number
  ): Promise<{ conversation: Conversation; messages: ChatMessage[] }> {
    const { data } = await apiClient.get<
      ApiResource<{ conversation: Conversation; messages: ChatMessage[] }>
    >(API_ENDPOINTS.admin.chatMessages(conversationId));
    return data.data;
  },

  async sendMessage(conversationId: number, body: string): Promise<ChatMessage> {
    const { data } = await apiClient.post<ApiResource<ChatMessage>>(
      API_ENDPOINTS.admin.chatMessages(conversationId),
      { body }
    );
    return data.data;
  },

  async markRead(conversationId: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.admin.chatRead(conversationId));
  },
};
