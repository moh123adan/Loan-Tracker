"use client";

import Dashboard from "./pages/dashboard";
import { Toaster, toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <>
      <Toaster />
      <Dashboard />
    </>
  );
}
