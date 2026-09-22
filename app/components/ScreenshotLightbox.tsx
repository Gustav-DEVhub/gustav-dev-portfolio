"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import type { ThemeId } from "./CliShell";

/**
 * Builds the public URL for a project screenshot. Kept here (and imported by
 * the /work thumbnail grid) so the `/projects/<id>/<file>` template lives in
 * exactly one place.
 */
export function screenshotSrc(projectId: string, filename: string): string {
  return `/projects/${projectId}/${filename}`;
}

interface ScreenshotLightboxProps {
  projectId: string;
  screenshots: { filename: string; description: string }[];
  initialIndex: number;
  activeTheme: ThemeId;
  onClose: () => void;
}

/**
 * Phase 4a + 4b — modal mechanics with navigation.
 *
 * Phase 4a: open/close (backdrop click, X button, Escape), focus on close
 * button, scroll lock, themed backdrop with blur, portal to document.body.
 *
 * Phase 4b: cyclic prev/next navigation via desktop arrow buttons, ArrowLeft/
 * ArrowRight keyboard shortcuts, mobile swipe gestures, position counter, and
 * a minimal Tab/Shift+Tab focus trap among the dialog's focusable elements
 * (close + arrows when arrows are rendered). No zoom/pan/pinch (Phase 4c).
 */
export function ScreenshotLightbox({
  projectId,
  screenshots,
  initialIndex,
  activeTheme,
  onClose,
}: ScreenshotLightboxProps) {
  const isMobile = useIsMobile();
  // Phase 4b — reactive index state with navigation handlers.
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const pointerStartX = useRef<number>(0);
  const pointerStartY = useRef<number>(0);
  const activePointerId = useRef<number | null>(null);

  // Phase 4c-3 — zoom + pan state
  const ZOOM_SCALE = 2.5;
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const panStart = useRef<{ x: number; y: number; translateX: number; translateY: number } | null>(null);
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null);

  const hasMultiple = screenshots.length > 1;

  const goToPrevious = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setTransformOrigin("50% 50%");
    setCurrentIndex((i) => (i - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);
  const goToNext = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setTransformOrigin("50% 50%");
    setCurrentIndex((i) => (i + 1) % screenshots.length);
  }, [screenshots.length]);

  // Tap / double-tap handler (used both for the scale===1 "not a swipe" path
  // and for the scale>1 "tiny movement" path). Must be a stable function so
  // the inline handlers above can close over it without re-creation each render.
  const handleTap = (event: React.PointerEvent<HTMLDivElement>) => {
    const now = Date.now();
    const isDoubleTap =
      lastTap.current !== null &&
      now - lastTap.current.time < 300 &&
      Math.hypot(event.clientX - lastTap.current.x, event.clientY - lastTap.current.y) < 30;

    if (isDoubleTap) {
      lastTap.current = null;
      if (scale > 1) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const originX = ((event.clientX - rect.left) / rect.width) * 100;
        const originY = ((event.clientY - rect.top) / rect.height) * 100;
        setTransformOrigin(`${originX}% ${originY}%`);
        setTranslate({ x: 0, y: 0 });
        setScale(ZOOM_SCALE);
      }
    } else {
      lastTap.current = { time: now, x: event.clientX, y: event.clientY };
    }
  };

  // Clamp a proposed translate so the scaled image can never be dragged fully
  // out of view. See §7 of the phase write-up for the derivation.
  const clampTranslate = (px: number, py: number, s: number) => {
    const wrapper = imageWrapperRef.current;
    if (!wrapper) return { x: px, y: py };

    // offsetWidth/offsetHeight are the UNSCALED layout size; getBoundingClientRect()
    // would return the already-scaled paint rect and inflate every bound by s.
    // For scale(s) translate(tx, ty) about origin (ox, oy) the image's left edge is
    // s * tx - ox * w * (s - 1), so keeping the image covering the container gives:
    //   tx in [-(1 - ox) * w * (s - 1) / s, ox * w * (s - 1) / s]
    const w = wrapper.offsetWidth;
    const h = wrapper.offsetHeight;
    if (w === 0 || h === 0 || s <= 1) return { x: 0, y: 0 };

    const [ox, oy] = parseTransformOrigin(transformOrigin);
    const maxPanX = (w * (s - 1)) / s;
    const maxPanY = (h * (s - 1)) / s;

    const txMin = -(1 - ox) * maxPanX;
    const txMax = ox * maxPanX;
    const tyMin = -(1 - oy) * maxPanY;
    const tyMax = oy * maxPanY;

    return {
      x: Math.min(Math.max(px, txMin), txMax),
      y: Math.min(Math.max(py, tyMin), tyMax),
    };
  };

  const parseTransformOrigin = (origin: string): [number, number] => {
    // origin is a string like "50% 50%" or "33.33% 66.67%" or "center top".
    // We only ever set it ourselves via setTransformOrigin(`${originX}% ${originY}%`),
    // so it should always be in "X% Y%" form, but parse defensively.
    const parts = origin.trim().split(/\s+/);
    const parsePart = (part: string, def: number): number => {
      if (part.endsWith("%")) {
        return parseFloat(part) / 100;
      }
      // Keyword fallback — map common keywords to fractions.
      const lower = part.toLowerCase();
      if (lower === "left" || lower === "top") return 0;
      if (lower === "center" || lower === "middle") return 0.5;
      if (lower === "right" || lower === "bottom") return 1;
      return def;
    };
    const ox = parsePart(parts[0] ?? "", 0.5);
    const oy = parsePart(parts[1] ?? parts[0] ?? "", 0.5);
    return [Math.min(Math.max(ox, 0), 1), Math.min(Math.max(oy, 0), 1)];
  };

  const screenshot = screenshots[currentIndex];

  // Keyboard navigation + focus trap — single document-level listener.
  // Escapes closes; ArrowLeft/ArrowRight navigate (cyclic); Tab/Shift+Tab
  // cycle among the dialog's own focusable elements (close + arrows, when
  // arrows are rendered). All handlers use functional setCurrentIndex updates
  // so the effect's deps stay minimal and correct per
  // react-hooks/exhaustive-deps.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (!hasMultiple) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
        return;
      }

      if (event.key === "Tab") {
        // Determine first/last focusable in tab order: prev, next, close
        // (prev < next < close). When arrows are hidden, close is both first
        // and last, so any Tab just keeps focus on it (no cycle needed).
        const first = prevButtonRef.current ?? closeButtonRef.current;
        const last = nextButtonRef.current ?? closeButtonRef.current;
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (active && last && last === active) {
            event.preventDefault();
            first?.focus();
          }
        } else {
          if (active && first && first === active) {
            event.preventDefault();
            last?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultiple, screenshots.length, onClose, goToNext, goToPrevious]);

  // Focus starts on the close button. Restoring focus to the triggering
  // thumbnail is the caller's job — this component has no access to it.
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Scroll lock: read the previous inline value before overwriting it and put
  // that exact value back on unmount (never hardcode "visible").
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!screenshot) return null;

  return createPortal(
    // data-theme is re-applied here because the portal lives on document.body,
    // outside the CliShell subtree where the theme attribute normally sits —
    // without it the modal would fall back to the dark :root variables.
    <div
      data-theme={activeTheme === "dark" ? undefined : activeTheme}
      className="screenshot-lightbox fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      onClick={(event) => {
        // React portal events bubble through the React tree, not the DOM tree,
        // so this stop is what keeps the click away from CliShell's root
        // onClick={focusInput}.
        event.stopPropagation();
        onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Screenshot: ${screenshot.description}`}
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-[var(--window-border)] bg-[var(--window-bg)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Title bar — same chrome row language as TerminalHeader, minus the dots.
            The flex-1 wrapper on the left reserves space for the counter (when
            present) and keeps the close button pinned to the right regardless of
            whether the counter renders. */}
        <div className="flex items-center border-b border-[var(--frame-border)] bg-[var(--frame-bg)] px-3 py-1.5 select-none sm:px-4">
          <div className="flex-1">
            {hasMultiple && (
              <span className="font-mono text-[10px] tracking-wide text-zinc-500">
                {currentIndex + 1} / {screenshots.length}
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close"
            title="Close"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded font-mono text-lg leading-none text-[var(--body-text)] transition-colors hover:bg-[var(--suggestion-hover-bg)] hover:text-[var(--accent-violet)]"
          >
            ×
          </button>
        </div>

        {/* Image area — object-contain, so the full screenshot is visible
            instead of the grid's center crop. */}
        <div
          className="relative flex w-full items-center justify-center bg-black/30 touch-none overflow-hidden"
          onPointerDown={(event) => {
            if (!event.isPrimary) return;
            // Only the primary (left) mouse button may start a pan/drag.
            if (event.pointerType === "mouse" && event.button !== 0) {
              // A non-primary button must never drive a pan — including a pan whose
              // pointerup was swallowed by a native image drag — so drop any leftover state.
              activePointerId.current = null;
              panStart.current = null;
              return;
            }
            // A press that starts on a button (e.g. the prev/next arrows) must not start a
            // pan/drag gesture or capture the pointer — otherwise the container steals the
            // derived click/dblclick stream from the button and it never fires.
            if ((event.target as Element).closest("button")) return;
            activePointerId.current = event.pointerId;
            pointerStartX.current = event.clientX;
            pointerStartY.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);

            if (scale > 1) {
              panStart.current = { x: event.clientX, y: event.clientY, translateX: translate.x, translateY: translate.y };
            }
          }}
          onPointerMove={(event) => {
            if (event.pointerId !== activePointerId.current) return;

            if (scale > 1 && panStart.current) {
              const rawDeltaX = event.clientX - panStart.current.x;
              const rawDeltaY = event.clientY - panStart.current.y;
              // Pointer moves in screen pixels; translate is applied in the
              // pre-scale coordinate space of the transform. Since the transform
              // applies translate FIRST (in unscaled units) then scale, a screen
              // movement of Npx corresponds to N/scale in translate space.
              const proposedX = panStart.current.translateX + rawDeltaX / scale;
              const proposedY = panStart.current.translateY + rawDeltaY / scale;
              setTranslate(clampTranslate(proposedX, proposedY, scale));
              event.preventDefault();
              return;
            }

            if (scale === 1 && event.pointerType === "touch") {
              if (hasMultiple) {
                event.preventDefault();
              }
            }
          }}
          onPointerUp={(event) => {
            if (event.pointerId !== activePointerId.current) return;
            activePointerId.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
            const panInfo = panStart.current;
            panStart.current = null;

            if (scale > 1) {
              // While zoomed, a pointer-up ends the pan. If the movement was
              // tiny (< 10px) and this was a touch, treat it as a potential
              // tap/double-tap rather than a finished pan.
              const moved = panInfo ? Math.hypot(
                event.clientX - panInfo.x,
                event.clientY - panInfo.y,
              ) : 0;
              if (moved < 10 && event.pointerType === "touch") {
                handleTap(event);
              }
              return;
            }

            if (scale === 1 && event.pointerType === "touch") {
              const deltaX = event.clientX - pointerStartX.current;
              const deltaY = event.clientY - pointerStartY.current;

              // Horizontal-dominant threshold: at least 50px horizontal movement
              // and horizontal dominates vertical (to avoid triggering on vertical
              // scrolls/drags).
              if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                // Swipe left (negative delta) → next; swipe right → previous
                if (deltaX < 0) {
                  goToNext();
                } else {
                  goToPrevious();
                }
              } else {
                // Not a swipe — treat as a tap/double-tap.
                handleTap(event);
              }
            }
          }}
          onPointerCancel={(event) => {
            if (event.pointerId !== activePointerId.current) return;
            activePointerId.current = null;
            panStart.current = null;
          }}
          onDoubleClick={(event) => {
            event.stopPropagation();
            if (scale > 1) {
              setScale(1);
              setTranslate({ x: 0, y: 0 });
              return;
            }
            const rect = event.currentTarget.getBoundingClientRect();
            const originX = ((event.clientX - rect.left) / rect.width) * 100;
            const originY = ((event.clientY - rect.top) / rect.height) * 100;
            setTransformOrigin(`${originX}% ${originY}%`);
            setTranslate({ x: 0, y: 0 });
            setScale(ZOOM_SCALE);
          }}
        >
          {/* Desktop prev/next arrows — only rendered when there's something to
              navigate between AND we're not on mobile (mobile uses swipe). */}
          {hasMultiple && !isMobile && (
            <>
              <button
                ref={prevButtonRef}
                type="button"
                aria-label="Previous screenshot"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                onDoubleClick={(event) => event.stopPropagation()}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded bg-[var(--frame-bg)]/60 bg-black/40 font-mono text-lg text-[var(--body-text)] transition-colors hover:bg-[var(--frame-bg)] hover:text-[var(--accent-violet)] sm:left-3 sm:top-1/2 sm:-translate-y-1/2"
              >
                ‹
              </button>
              <button
                ref={nextButtonRef}
                type="button"
                aria-label="Next screenshot"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                onDoubleClick={(event) => event.stopPropagation()}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded bg-[var(--frame-bg)]/60 bg-black/40 font-mono text-lg text-[var(--body-text)] transition-colors hover:bg-[var(--frame-bg)] hover:text-[var(--accent-violet)] sm:right-3 sm:top-1/2 sm:-translate-y-1/2"
              >
                ›
              </button>
            </>
          )}

          <div
            ref={imageWrapperRef}
            style={{
              transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
              transformOrigin,
              transition: scale === 1 && translate.x === 0 && translate.y === 0 ? "transform 150ms ease-out" : "none",
            }}
            className="h-auto w-full"
          >
            <Image
              key={currentIndex}
              src={screenshotSrc(projectId, screenshot.filename)}
              alt={screenshot.description}
              width={1280}
              height={720}
              className="h-auto w-full object-contain max-h-[70vh] sm:max-h-[75vh]"
              draggable={false}
            />
          </div>
        </div>

        {screenshot.description && (
          <p className="border-t border-zinc-800/60 px-3 py-2 font-mono text-[10px] leading-snug text-zinc-500 sm:px-4">
            {screenshot.description}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}