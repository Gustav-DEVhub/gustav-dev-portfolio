"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { CLI_COMMANDS, filterCommands, normalizeCommand, type CliCommand } from "@/lib/commands";
import { SuggestionMenu } from "./SuggestionMenu";

interface TerminalInputProps {
  onSubmit: (command: string) => void;
  history: string[];
  placeholder?: string;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  function TerminalInput({ onSubmit, history, placeholder }, ref) {
    const innerRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [cyclePool, setCyclePool] = useState<CliCommand[]>([...CLI_COMMANDS]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [historyIndex, setHistoryIndex] = useState(-1);

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const matches = menuOpen ? cyclePool : filterCommands(value);
    const showMenu = menuOpen && matches.length > 0;
    const activeIndex =
      matches.length === 0
        ? 0
        : Math.min(selectedIndex, matches.length - 1);

    const submit = (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      // Normalize slash-less commands to their slash versions for execution
      const normalized = normalizeCommand(trimmed);
      onSubmit(normalized);
      setValue("");
      setMenuOpen(false);
      setSelectedIndex(0);
      setHistoryIndex(-1);
      setCyclePool([...CLI_COMMANDS]);
    };

    const handleChange = (next: string) => {
      setValue(next);
      setHistoryIndex(-1);
      if (next.startsWith("/") || (next.length > 0 && !next.includes(" "))) {
        // Show suggestions for slash commands OR for slash-less command prefixes
        const pool = filterCommands(next);
        setCyclePool(pool);
        setMenuOpen(pool.length > 0);
        setSelectedIndex(0);
      } else {
        setMenuOpen(false);
        setSelectedIndex(0);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const pool = menuOpen
          ? cyclePool
          : value.trim() === ""
            ? [...CLI_COMMANDS]
            : filterCommands(value);
        if (pool.length === 0) return;
        const next = menuOpen ? (activeIndex + 1) % pool.length : 0;
        setCyclePool(pool);
        setMenuOpen(true);
        setSelectedIndex(next);
        // When cycling with Tab, resolve slash-less to full command for display
        const selectedCmd = pool[next].cmd;
        setValue(selectedCmd);
        return;
      }

      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (showMenu) {
          const next = activeIndex <= 0 ? cyclePool.length - 1 : activeIndex - 1;
          setSelectedIndex(next);
          return;
        }
        if (historyIndex < history.length - 1) {
          const nextIndex = historyIndex + 1;
          setHistoryIndex(nextIndex);
          setValue(history[nextIndex]);
          setMenuOpen(false);
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (showMenu) {
          setSelectedIndex((activeIndex + 1) % cyclePool.length);
          return;
        }
        if (historyIndex > 0) {
          const nextIndex = historyIndex - 1;
          setHistoryIndex(nextIndex);
          setValue(history[nextIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setValue("");
        }
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (showMenu && cyclePool[activeIndex]) {
          submit(cyclePool[activeIndex].cmd);
        } else {
          submit(value);
        }
      }
    };

    return (
      <div className="relative border-t border-zinc-800 bg-[#0d1117] px-3 py-3 sm:px-4">
        {showMenu && (
          <SuggestionMenu
            commands={matches}
            selectedIndex={activeIndex}
            onHover={setSelectedIndex}
            onSelect={submit}
          />
        )}
        <div className="flex items-center gap-2">
          <span className="select-none text-sm font-bold text-[var(--accent-violet)]">$</span>
          <input
            ref={innerRef}
            type="text" role="combobox" aria-controls="suggestions"
            value={value}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={placeholder}
            aria-label="Terminal command"
            aria-autocomplete="list"
            aria-expanded={showMenu}
            className="flex-1 bg-transparent font-[family-name:var(--font-geist-mono)] text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="h-4 w-2 animate-pulse bg-[var(--accent-violet)]" />
        </div>
      </div>
    );
  }
);
