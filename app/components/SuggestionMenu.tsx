"use client";

import type { CliCommand } from "@/lib/commands";

interface SuggestionMenuProps {
  commands: CliCommand[];
  selectedIndex: number;
  onHover: (index: number) => void;
  onSelect: (cmd: string) => void;
}

export function SuggestionMenu({ commands, selectedIndex, onHover, onSelect }: SuggestionMenuProps) {
  return (
    <div
      id="suggestions"
      role="listbox"
      className="absolute bottom-full left-0 right-0 z-10 mb-1 max-h-56 overflow-auto rounded-md border border-zinc-700 bg-[#161b22] shadow-lg"
    >
      {commands.map((command, index) => (
        <button
          key={command.cmd}
          type="button"
          role="option"
          aria-selected={index === selectedIndex}
          className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
            index === selectedIndex
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-300 hover:bg-zinc-800"
          }`}
          onMouseEnter={() => onHover(index)}
          onClick={() => onSelect(command.cmd)}
        >
          <span className="font-mono text-[var(--accent-violet)]">{command.cmd}</span>
          <span className="text-xs text-zinc-500">— {command.hint}</span>
        </button>
      ))}
    </div>
  );
}