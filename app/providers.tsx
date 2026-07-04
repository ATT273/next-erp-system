"use client";

import type { ThemeProviderProps } from "next-themes";
import { Toast } from "@heroui/react";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHeroUIThemeStore } from "./stores/heroui-theme-store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function HeroProviders({ children, themeProps }: ProvidersProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider>
        <Toast.Provider placement="top" />
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
