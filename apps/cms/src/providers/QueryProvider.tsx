"use client";

import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

function extractMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (typeof e["message"] === "string") return e["message"];
  }
  return "خطای ناشناخته";
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            const msg = extractMessage(err);
            if (!msg.includes("401")) toast.error(msg);
          },
        }),
        mutationCache: new MutationCache({
          onError: (err) => {
            toast.error(extractMessage(err));
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 3,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}
