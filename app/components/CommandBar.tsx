"use client";

import type { ActiveView } from "./CliShell";

interface CommandBarProps {
  onCommand: (cmd: string) => void;
  currentView: ActiveView;
}

const allCommands = [
  { label: "/help", cmd: "/help", icon: "?" },
  { label: "/about", cmd: "/about", icon: "i" },
  { label: "/work", cmd: "/work", icon: "⊕" },
  { label: "/contact", cmd: "/contact", icon: "✉" },
  { label: "/github", cmd: "/github", icon: "⌥" },
  { label: "/linkedin", cmd: "/linkedin", icon: "in" },
  { label: "/clear", cmd: "/clear", icon: "⊘" },
];

export function CommandBar({ onCommand, currentView }: CommandBarProps) {
  return (
    <div className="flex flex-wrap gap-2" role="navigation" aria-label="Portfolio commands">
      {allCommands.map(({ label, cmd, icon }) => {
        const isActive =
          (cmd === "/about" && currentView === "about") ||
          (cmd === "/work" && currentView === "work") ||
          (cmd === "/contact" && currentView === "contact");

        return (
          <button
            key={cmd}
            onClick={(e) => {
              e.stopPropagation();
              onCommand(cmd);
            }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
              transition-all duration-150 border
              ${
                isActive
                  ? "bg-green-400/10 text-green-400 border-green-400/30"
                  : "bg-zinc-800/50 text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800"
              }
            `}
            aria-label={`Run ${label}`}
          >
            <span className="text-[10px] opacity-60">{icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
