"use client";

import DashboardSidebar from "@/components/dashboard-sidebar";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
