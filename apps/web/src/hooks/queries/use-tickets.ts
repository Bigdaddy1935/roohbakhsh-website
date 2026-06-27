"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { Ticket, CreateTicketRequest, PaginatedTickets } from "@roohbakhsh/shared";

export const ticketKeys = {
  mine: (params?: Record<string, unknown>) => ["tickets", "mine", params] as const,
  detail: (id: string) => ["tickets", "detail", id] as const,
};

export function useMyTickets(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedTickets>({
    queryKey: ticketKeys.mine(params),
    queryFn: () => api.get<PaginatedTickets>(`/tickets/mine${query}`),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useTicket(id: string) {
  return useQuery<Ticket>({
    queryKey: ticketKeys.detail(id),
    queryFn: () => api.get<Ticket>(`/tickets/${id}`),
    enabled: !!id && typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, CreateTicketRequest>({
    mutationFn: (body) => api.post<Ticket>("/tickets", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "me"] });
    },
  });
}

export function useReplyTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, { id: string; body: string }>({
    mutationFn: ({ id, body }) => api.post<Ticket>(`/tickets/${id}/reply`, { body }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["tickets", "mine"] });
    },
  });
}

export function useCloseTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, string>({
    mutationFn: (id) => api.post<Ticket>(`/tickets/${id}/close`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ["tickets", "mine"] });
    },
  });
}
