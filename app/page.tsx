"use client";

import { useState, useSyncExternalStore } from "react";
import CliShell from "@/app/components/CliShell";
import { BootSequence } from "@/app/components/BootSequence";

const BOOT_FLAG_KEY = "portfolio_booted";

// React 19 / Next.js hydration-safe client detection
const emptySubscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

// Read sessionStorage reactively per-tab (SSR-safe: returns false until client mount)
function useSessionBootFlag(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      if (typeof window === "undefined") return false;
      try {
        return window.sessionStorage.getItem(BOOT_FLAG_KEY) === "true";
      } catch {
        return false;
      }
    },
    () => false
  );
}

export default function Home() {
  const isClient = useIsClient();
  const sessionBooted = useSessionBootFlag();
  // Local "completed this session" flag — set by the event handler below
  // (avoids calling setState inside useEffect)
  const [hasBooted, setHasBooted] = useState(false);

  // Combine: either the sessionStorage flag is set (came back to the tab),
  // or the user just completed the sequence in this tab.
  const booted = sessionBooted || hasBooted;

  const handleBootComplete = () => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem(BOOT_FLAG_KEY, "true");
      } catch {
        // Ignore storage errors
      }
    }
    setHasBooted(true);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--accent-violet)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-violet)] focus:ring-offset-2 focus:ring-offset-black"
      >
        Skip to main content
      </a>

      <header className="sr-only">
        <h1>Gustav Portfolio</h1>
      </header>

      <main
        id="main-content"
        className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-black p-4 sm:p-6 md:p-8"
      >
        {/* SSR fallback: render nothing inside the slot until hydration completes */}
        {!isClient ? (
          <div className="min-h-screen w-full" aria-hidden="true" />
        ) : booted ? (
          <CliShell />
        ) : (
          <BootSequence onComplete={handleBootComplete} />
        )}
      </main>

      <footer className="sr-only">
        <p>Portfolio by Gustav Calderon Tenorio - AI-Augmented Developer</p>
      </footer>
    </>
  );
}
