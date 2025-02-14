"use client";

import { AuthCheck } from "../pages/AuthCheck";
import Dashboard from '../pages/Dashboard';
import { Toaster } from "@/components/ui/toaster";

export default function DashboardPage() {
  return (
    <AuthCheck>
      <Toaster />
      <Dashboard />
    </AuthCheck>
  );
}