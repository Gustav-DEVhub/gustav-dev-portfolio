"use client";

import { useEffect, useRef } from "react";
import type { CliCommand } from "@/lib/commands";

interface SuggestionMenuProps {
  commands: CliCommand[];
  selectedIndex: number;
  onHover: (index: number) => void;
  onSelect: (cmd: string) => void;
}

export function SuggestionMenu({ commands, selectedIndex, onHover, onSelect }: SuggestionMenuProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  // Keep the arrow-selected row fully visible inside the max-h-56 overflow-auto
  // listbox. Only scroll when the selected row would otherwise be clipped,
  // scrolling the minimum amount needed (scrollIntoView({ block: "nearest" })
  // semantics) — never center the row permanently.
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const row = container.children[selectedIndex] as HTMLElement | undefined;
    if (!row) return;
    const cTop = container.getBoundingClientRect().top;
    const cBottom = container.getBoundingClientRect().bottom;
    const rTop = row.getBoundingClientRect().top;
    const rBottom = row.getBoundingClientRect().bottom;
    if (rTop < cTop) {
      container.scrollTop -= Math.ceil(cTop - rTop);
    } else if (rBottom > cBottom) {
      container.scrollTop += Math.ceil(rBottom - cBottom);
    }
  }, [selectedIndex, commands.length]);

  return (
    <div
      id="suggestions"
      ref={listRef}
      role="listbox"
      className="absolute bottom-full left-0 right-0 z-10 mb-1 max-h-56 overflow-auto rounded-md border border-[var(--window-border)] bg-[var(--frame-bg)] shadow-lg"
    >
      {commands.map((command, index) => (
        <button
          key={command.cmd}
          id={`suggestion-option-${index}`}
          type="button"
          role="option"
          aria-selected={index === selectedIndex}
          className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
            index === selectedIndex
              ? "bg-[var(--suggestion-selected-bg)] text-[var(--suggestion-selected-text)]"
              : "text-[var(--body-text)] hover:bg-[var(--suggestion-hover-bg)]"
          }`}
          onMouseEnter={() => onHover(index)}
          onClick={() => onSelect(command.cmd)}
        >
          <span className="font-mono text-[var(--accent-violet)]">{command.cmd}</span>
          <span className="text-xs text-[var(--suggestion-secondary-text)]">— {command.hint}</span>
        </button>
      ))}
    </div>
  );
}