"use client";

import { EntityProvider } from "@/components/entity-components/enittyContext";
import Sidebar from "@/components/layout/sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMinimized } = useSidebar();

  return (
    <EntityProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-[margin] duration-500",
            !isMinimized ? "ml-72" : "ml-[72px]"
          )}
        >
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </EntityProvider>
  );
}
