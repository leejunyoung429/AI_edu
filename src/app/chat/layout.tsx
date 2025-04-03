"use client";

import { Metadata } from "next";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {children}
    </div>
  );
}
