"use client";

import { AuthCheck } from "@/app/pages/AuthCheck";
import Dashboard from "@/app/pages/Dashboard/index";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardPage() {
  return (
    <AuthCheck>
      <Toaster />
      <Dashboard />
    </AuthCheck>
  );
}
