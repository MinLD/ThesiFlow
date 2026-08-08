"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { AuthProvider } from "../features/auth/AuthProvider";
import { TenantProvider } from "../features/tenancy/TenantProvider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}><AuthProvider><TenantProvider>{children}</TenantProvider></AuthProvider></QueryClientProvider>;
}
