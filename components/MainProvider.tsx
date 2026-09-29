"use client";

import { SessionProvider } from "next-auth/react";

export const MainProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};