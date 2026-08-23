"use client";
// 


import { forwardRef } from "react";

interface TerminalInputProps {
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput({ onKeyDown, placeholder }, ref) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800 bg-[#0d1117]">
        <span className="text-green-400 text-sm font-bold select-none">$</span>
        <input
          ref={ref}
          type="text"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-zinc-200 text-sm outline-none placeholder:text-zinc-600 font-[family-name:var(--font-geist-mono)]"
          onKeyDown={onKeyDown}
        />
        <span className="w-2 h-4 bg-green-400 animate-pulse" />
      </div>
    );
  }
);
