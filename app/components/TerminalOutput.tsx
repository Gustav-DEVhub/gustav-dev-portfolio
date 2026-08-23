"use client";

import { forwardRef } from "react";
import type { OutputLine } from "./CliShell";

interface TerminalOutputProps {
  lines: OutputLine[];
}

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  function TerminalOutput({ lines }, ref) {
    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 pb-2"
      >
        {lines.map((line) => (
          <div key={line.id} className="mb-2">
            {line.type === "command" && (
              <p className="text-green-400 text-sm">
                <span className="text-zinc-500 select-none">$ </span>
                <span>{line.content.replace(/^\$ /, "")}</span>
              </p>
            )}
            {line.type === "system" && (
              <pre className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">
                {line.content}
              </pre>
            )}
            {line.type === "response" && (
              <p className="text-zinc-300 text-sm leading-relaxed">
                {line.content}
              </p>
            )}
            {line.type === "error" && (
              <p className="text-red-400 text-sm">{line.content}</p>
            )}
          </div>
        ))}
      </div>
    );
  }
);
