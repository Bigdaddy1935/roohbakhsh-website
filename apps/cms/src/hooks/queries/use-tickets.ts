"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Ticket, PaginatedTickets, ReplyTicketRequest } from "@roohbakhsh/shared";

export const ticketKeys = {
  list: (params?: Record<string, unknown>) => ["tickets", "admin-list", params] as const,
  detail: (id: string) => ["tickets", "detail", id] as const,
};

export function useTicketsAdmin(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedTickets>({
    queryKey: ticketKeys.list(params),
    queryFn: () => api.get<PaginatedTickets>(`/tickets${query}`),
  });
}

export function useTicket(id: string) {
  return useQuery<Ticket>({
    queryKey: ticketKeys.detail(id),
    queryFn: () => api.get<Ticket>(`/tickets/${id}`),
    enabled: !!id,
  });
}

export function useReplyTicket(id: string) {
  const qc = useQueryClient();
  return useMutation<Ticket, Error, ReplyTicketRequest>({
    mutationFn: (body) => api.post<Ticket>(`/tickets/${id}/reply`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      qc.invalidateQueries({ queryKey: ["tickets", "admin-list"] });
    },
  });
}

export function useCloseTicket() {
  const qc = useQueryClient();
  return useMutation<Ticket, Error, string>({
    mutationFn: (id) => api.post<Ticket>(`/tickets/${id}/close`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}
