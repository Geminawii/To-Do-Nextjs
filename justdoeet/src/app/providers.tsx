"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Toaster } from "@/components/ui/sonner";
import { DndContext } from "@dnd-kit/core";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60,
          },
        },
      })
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const persister = createAsyncStoragePersister({
        storage: window.localStorage,
      });

      persistQueryClient({
        queryClient,
        persister,
        buster: "v1",
      });
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <DndContext>
        {children}
        <Toaster />
      </DndContext>
    </QueryClientProvider>
  );
}
