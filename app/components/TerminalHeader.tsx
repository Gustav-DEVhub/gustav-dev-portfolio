"use client";

interface TerminalHeaderProps {
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export function TerminalHeader({
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
}: TerminalHeaderProps) {
  return (
    <div className="flex items-center gap-1 border-b border-zinc-800 bg-[#161b22] px-2 py-2.5 select-none sm:gap-2 sm:px-4 sm:py-3">
      <div className="mr-1 flex items-center gap-1 sm:mr-3 sm:gap-2">
        <button
          type="button"
          aria-label="Close terminal"
          title="Close"
          className="flex h-11 w-11 items-center justify-center sm:h-auto sm:w-auto"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
        >
          <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.55)] hover:brightness-110 sm:h-3 sm:w-3" />
        </button>
        <button
          type="button"
          aria-label="Minimize terminal"
          title="Minimize"
          className="flex h-11 w-11 items-center justify-center sm:h-auto sm:w-auto"
          onClick={(event) => {
            event.stopPropagation();
            onMinimize();
          }}
        >
          <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.45)] hover:brightness-110 sm:h-3 sm:w-3" />
        </button>
        <button
          type="button"
          aria-label={isMaximized ? "Restore terminal" : "Maximize terminal"}
          title={isMaximized ? "Restore" : "Maximize"}
          className="flex h-11 w-11 items-center justify-center sm:h-auto sm:w-auto"
          onClick={(event) => {
            event.stopPropagation();
            onMaximize();
          }}
        >
          <span className="h-3.5 w-3.5 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.45)] hover:brightness-110 sm:h-3 sm:w-3" />
        </button>
      </div>

      <div className="min-w-0 flex-1 text-center">
        <p className="block text-[8px] text-zinc-500 sm:text-[10px] sm:tracking-wide">
          gustav@tenorio ~ /portfolio
        </p>
      </div>
      <div className="w-4 sm:w-14" />
    </div>
  );
}
