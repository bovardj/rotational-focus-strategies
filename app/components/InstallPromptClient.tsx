"use client";

import dynamic from "next/dynamic";

export default dynamic(
  () => import("@/app/components/pwaComponents").then((m) => m.InstallPrompt),
  { ssr: false }
);
