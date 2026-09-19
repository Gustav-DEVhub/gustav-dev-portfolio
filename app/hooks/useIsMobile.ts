"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe mobile detection at the app's `sm` breakpoint (640px).
 *
 * Mirrors the SSR-safe pattern already used in app/page.tsx and
 * app/components/BootSequence.tsx (`useSyncExternalStore` with a stable
 * server snapshot), so:
 *  - Server render / hydration always see `false` (desktop-safe default —
 *    the same "default to desktop until the client confirms" philosophy as
 *    `useIsClient`).
 *  - On the client, the snapshot reads the live media query.
 *  - The `matchMedia` change listener keeps the value current across
 *    viewport changes — no bespoke resize/debounce logic needed.
 *  - `(max-width: 639px)` matches Tailwind's `sm:` breakpoint (640px) used
 *    throughout the rest of the app.
 */
const MOBILE_QUERY = "(max-width: 639px)";

function subscribe(onStoreChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(MOBILE_QUERY);
  mediaQueryList.addEventListener("change", onStoreChange);
  return () => mediaQueryList.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

const getServerSnapshot = (): boolean => false;

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
