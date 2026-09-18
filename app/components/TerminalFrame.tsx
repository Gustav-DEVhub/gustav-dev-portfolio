"use client";

import { ReactNode } from "react";
import { TerminalHeader } from "./TerminalHeader";

interface TerminalFrameProps {
  children: ReactNode;
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClick?: () => void;
  className?: string;
  /** Disable default shell-min-height so boot sequence can use its own */
  compact?: boolean;
}

/**
 * Shared outer terminal window frame used by both the boot sequence and the
 * active CLI shell. Renders the standard rounded card, dark background, macOS
 * traffic-light dots, and "gustav@tenorio ~ /portfolio" header.
 *
 * The same outer dimensions are used for both states so the transition
 * between boot and shell produces zero layout shift.
 */
export function TerminalFrame({
  children,
  isMaximized = false,
  onClose,
  onMinimize,
  onMaximize,
  onClick,
  className = "",
  compact = false,
}: TerminalFrameProps) {
  return (
    <div
      className={`${
        isMaximized ? "fixed" : "relative"
      } mx-auto flex w-full flex-col overflow-hidden rounded-lg border border-zinc-700 bg-[#0d1117] shadow-2xl transition-all duration-300 ease-out ${
        isMaximized
          ? "inset-0 z-50 h-[100dvh] w-[100dvw] rounded-none border-0"
          : compact
            ? "max-h-[80vh] max-w-5xl"
            : "min-h-[60vh] max-h-[90vh] min-w-0 max-w-5xl sm:min-h-[70vh] md:min-h-[75vh]"
      } ${className}`}
      onClick={onClick}
    >
      {onClose && onMinimize && onMaximize ? (
        <TerminalHeader
          isMaximized={isMaximized}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />
      ) : (
        <ReadOnlyTerminalHeader />
      )}
      {children}
    </div>
  );
}

/**
 * Static header used when the terminal is not user-controllable (e.g. during
 * the boot sequence). Shows the same dots + title text as TerminalHeader but
 * with no close/minimize/maximize buttons.
 */
function ReadOnlyTerminalHeader() {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--frame-border)] bg-[var(--frame-bg)] px-3 py-2.5 select-none sm:px-4 sm:py-3">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="min-w-0 flex-1 text-center">
        <p className="hidden text-[10px] tracking-wide text-zinc-500 sm:block">
          gustav@tenorio ~ /portfolio
        </p>
      </div>
      <div className="w-12 sm:w-16" aria-hidden="true" />
    </div>
  );
}
