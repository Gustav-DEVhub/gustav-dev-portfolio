"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { TerminalFrame } from "./TerminalFrame";

interface BootSequenceProps {
  onComplete: () => void;
}

// React 19 / Next.js hydration-safe client detection
const emptySubscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

const BOOT_LINES: string[] = [
  "SYS:: INITIALIZING PORTFOLIO CORE...",
  "SYS:: Loading system parameters...",
  "SYS:: Mounting component modules...",
  "PROGRESS::",
  "SYS:: Resolving case studies & architecture...",
  "SYS:: Strategic positioning: AI-Augmented Developer",
  "\u2605 gustavo.dev v1.0.0 \u2014 ready.",
  "PROMPT::",
];

const LINE_INTERVAL_MS = 220;
const PROGRESS_TICK_MS = 18;
const PROGRESS_FILL = "\u2588";
const PROGRESS_EMPTY = "\u2591";
const PROGRESS_BAR_WIDTH = 20;

function buildProgressBar(percent: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const filled = Math.round((clamped / 100) * PROGRESS_BAR_WIDTH);
  const empty = PROGRESS_BAR_WIDTH - filled;
  return `[${PROGRESS_FILL.repeat(filled)}${PROGRESS_EMPTY.repeat(empty)}] ${String(clamped).padStart(3, " ")}% ok`;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const isClient = useIsClient();
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  const lineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  const clearAllTimers = useCallback(() => {
    if (lineTimerRef.current) {
      clearTimeout(lineTimerRef.current);
      lineTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const finalize = useCallback(() => {
    clearAllTimers();
    setProgress(100);
    setLineIndex(BOOT_LINES.length);
    setFinished(true);
  }, [clearAllTimers]);

  // Keep the onComplete ref in sync with the latest prop (avoids ref mutation during render)
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Sequence driver: start progress tick + line feed once on the client
  useEffect(() => {
    if (!isClient) return;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
          }
          return 100;
        }
        const increment = prev < 60 ? 2 : 1;
        return Math.min(100, prev + increment);
      });
    }, PROGRESS_TICK_MS);

    let current = 0;
    const revealNext = () => {
      current += 1;
      setLineIndex(current);
      if (current < BOOT_LINES.length - 1) {
        lineTimerRef.current = setTimeout(revealNext, LINE_INTERVAL_MS);
      } else {
        setFinished(true);
      }
    };
    lineTimerRef.current = setTimeout(revealNext, LINE_INTERVAL_MS);

    return () => {
      clearAllTimers();
    };
  }, [isClient, clearAllTimers]);

  // Keyboard listener: ENTER/SPACE completes when finished, any key during loading → skip
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (finished && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onCompleteRef.current();
        return;
      }
      if (!finished) {
        event.preventDefault();
        finalize();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isClient, finished, finalize]);

  // SSR placeholder to prevent hydration mismatch (matches the shell dimensions)
  if (!isClient) {
    return (
      <div
        className="mx-auto flex w-full min-h-[60vh] max-h-[90vh] min-w-0 max-w-5xl flex-col overflow-hidden rounded-lg border border-zinc-700 bg-[#0d1117] shadow-2xl sm:min-h-[70vh] md:min-h-[75vh]"
        aria-hidden="true"
      />
    );
  }

  // Build display lines based on current line index
  const displayLines: { kind: "text" | "progress"; value: string }[] = [];
  for (let i = 0; i < lineIndex && i < BOOT_LINES.length; i += 1) {
    const raw = BOOT_LINES[i];
    if (raw === "PROGRESS::") {
      displayLines.push({ kind: "progress", value: buildProgressBar(progress) });
    } else if (raw === "PROMPT::") {
      // Prompt is rendered as a separate UI element below the log
      continue;
    } else {
      displayLines.push({ kind: "text", value: raw });
    }
  }

  const handleContainerClick = () => {
    if (finished) {
      onCompleteRef.current();
    } else {
      finalize();
    }
  };

  return (
    <TerminalFrame compact onClick={handleContainerClick} className="cursor-pointer">
      <div
        role="status"
        aria-live="polite"
        aria-label="System boot sequence"
        className="flex min-h-0 flex-1 flex-col items-start justify-start gap-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-zinc-300 sm:p-6 sm:text-sm"
      >
        {displayLines.map((line, idx) => {
          if (line.kind === "progress") {
            return (
              <p key={`boot-line-${idx}`} className="text-zinc-200">
                <span className="select-none text-zinc-500">$ </span>
                <span className="text-[var(--accent-green)]">{line.value}</span>
              </p>
            );
          }
          return (
            <p key={`boot-line-${idx}`} className="text-zinc-300">
              <span className="select-none text-zinc-500">$ </span>
              <span>{line.value}</span>
            </p>
          );
        })}

        {/* Minimalist CLI completion prompt: no button, just a blinking line */}
        {finished && (
          <p
            className="mt-2 inline-flex items-center gap-1 text-[var(--accent-violet)]"
            aria-label="Press Enter or click to continue"
          >
            <span className="select-none text-zinc-500">$ </span>
            <span className="animate-pulse">&gt; Press Enter to continue...</span>
          </p>
        )}
      </div>
    </TerminalFrame>
  );
}

export default BootSequence;

