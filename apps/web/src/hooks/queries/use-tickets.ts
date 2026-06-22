"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Ticket, CreateTicketRequest, ReplyTicketRequest, Paginated } from "@roohbakhsh/shared";

export const ticketKeys = {
  mine: ["tickets", "mine"] as const,
  detail: (id: string) => ["tickets", "detail", id] as const,
};

export function useMyTickets() {
  return useQuery<Ticket[]>({
    queryKey: ticketKeys.mine,
    queryFn: () => api.get<Ticket[]>("/tickets/mine"),
  });
}

export function useTicket(id: string) {
  return useQuery<Ticket>({
    queryKey: ticketKeys.detail(id),
    queryFn: () => api.get<Ticket>(`/tickets/${id}`),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, CreateTicketRequest>({
    mutationFn: (body) => api.post<Ticket>("/tickets", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.mine });
    },
  });
}

export function useReplyTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, { id: string; body: string }>({
    mutationFn: ({ id, body }) => api.post<Ticket>(`/tickets/${id}/reply`, { body }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.mine });
    },
  });
}

export function useCloseTicket() {
  const queryClient = useQueryClient();
  return useMutation<Ticket, Error, string>({
    mutationFn: (id) => api.post<Ticket>(`/tickets/${id}/close`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.mine });
    },
  });
}
