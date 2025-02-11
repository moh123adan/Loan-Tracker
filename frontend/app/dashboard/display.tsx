"use client";

import { AuthCheck } from "@/app/pages/AuthCheck";
import Dashboard from '@/app/pages/Dashboard';
import { Toaster } from "@/components/ui/toaster";

export default function Display() {
  return (
    <AuthCheck>
      <Toaster />
      <Dashboard />
    </AuthCheck>
  );
}
