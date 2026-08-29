"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CommandBar } from "./CommandBar";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput } from "./TerminalOutput";
import { TerminatedScreen } from "./TerminatedScreen";
import { normalizeCommand } from "@/lib/commands";
import {
  contactContent,
  helpText,
  projectsData,
} from "@/lib/data";

export type ActiveView = "terminal" | "about" | "work" | "contact";
type WindowState = "open" | "minimized" | "maximized" | "closed";

export type OutputLine = {
  id: number;
  type:
    | "hero"
    | "system"
    | "command"
    | "response"
    | "error"
    | "about"
    | "work"
    | "contact"
    | "loading";
  content: string;
};

// Thematic loading words pool
const LOADING_WORDS = [
  "Compiling",
  "Loading",
  "Querying",
  "Rendering",
  "Parsing",
  "Resolving",
];
const LOADER_DURATION = 1300;

export default function CliShell() {
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>("terminal");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [windowState, setWindowState] = useState<WindowState>("open");
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineCounter = useRef(0);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingLineIdRef = useRef<number | null>(null);
  const commandQueueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);
  const processCommandRef = useRef<((trimmed: string) => void) | null>(null);

  const getNextId = useCallback(() => {
    lineCounter.current += 1;
    return lineCounter.current;
  }, []);

  const addLine = useCallback(
    (type: OutputLine["type"], content = "") => {
      setOutputLines((prev) => [...prev, { id: getNextId(), type, content }]);
    },
    [getNextId]
  );

  const clearLoadingState = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    loadingLineIdRef.current = null;
  }, []);

  const getRandomLoadingWord = useCallback(() => {
    return LOADING_WORDS[Math.floor(Math.random() * LOADING_WORDS.length)];
  }, []);

  const removeLoadingLine = useCallback((lineId: number) => {
    setOutputLines((prev) => prev.filter((line) => line.id !== lineId));
  }, []);

  const scrollToTop = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = 0;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (loadingLineIdRef.current === null) {
      scrollToBottom();
    }
  }, [outputLines, scrollToBottom]);

  useEffect(() => {
    if (activeView === "work") {
      scrollToTop();
    }
  }, [activeView, scrollToTop]);

  useEffect(() => {
    setOutputLines([{ id: getNextId(), type: "hero", content: "" }]);
  }, [getNextId]);

  useEffect(() => {
    return () => {
      clearLoadingState();
    };
  }, [clearLoadingState]);

  const processCommand = useCallback(
    (trimmed: string) => {
      setCommandHistory((prev) => [...prev, trimmed]);
      addLine("command", trimmed);

      const cmd = normalizeCommand(trimmed);

      switch (cmd) {
        case "/help":
          setPendingCommand("help");
          addLine("system", "Loading help...");
          loadingLineIdRef.current = getNextId();
          loadingTimerRef.current = setTimeout(() => {
            addLine("system", helpText);
            setPendingCommand(null);
            loadingLineIdRef.current = null;
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommand(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break;

        case "/about":
          setPendingCommand("about");
          addLine("system", "Fetching about info...");
          loadingLineIdRef.current = getNextId();
          loadingTimerRef.current = setTimeout(() => {
            addLine("about");
            addLine(
              "system",
              "Type /contact to get in touch or /work to see my projects."
            );
            setPendingCommand(null);
            loadingLineIdRef.current = null;
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommand(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break;

        case "/work":
          setPendingCommand("work");
          addLine("system", "Loading projects...");
          loadingLineIdRef.current = getNextId();
          loadingTimerRef.current = setTimeout(() => {
            addLine("work");
            setActiveView("work");
            addLine("system", `${projectsData.length} projects loaded.`);
            setPendingCommand(null);
            loadingLineIdRef.current = null;
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommand(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break;

        case "/contact":
          setPendingCommand("contact");
          addLine("system", "Loading contact info...");
          loadingLineIdRef.current = getNextId();
          loadingTimerRef.current = setTimeout(() => {
            addLine("contact");
            setPendingCommand(null);
            loadingLineIdRef.current = null;
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommand(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break;

        case "/github":
          setPendingCommand("github");
          addLine("system", "Opening GitHub...");
          loadingLineIdRef.current = getNextId();
          loadingTimerRef.current = setTimeout(() => {
            window.open(contactContent.github, "_blank");
            addLine(
              "system",
              `Opening GitHub \u2192 ${contactContent.github}`
            );
            setPendingCommand(null);
            loadingLineIdRef.current = null;
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommand(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break;

        case "/linkedin":
          setPendingCommand("linkedin");
          addLine("system", "Opening LinkedIn...");
          loadingLineIdRef.current = getNextId();
          loadingTimerRef.current = setTimeout(() => {
            window.open(contactContent.linkedin, "_blank");
            addLine(
              "system",
              `Opening LinkedIn \u2192 ${contactContent.linkedin}`
            );
            setPendingCommand(null);
            loadingLineIdRef.current = null;
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommand(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break;

        case "/clear":
          setOutputLines([{ id: getNextId(), type: "hero", content: "" }]);
          break;

        default:
          if (cmd.startsWith("/project ")) {
            const num = parseInt(cmd.split(" ")[1], 10);
            if (!isNaN(num) && num >= 1 && num <= projectsData.length) {
              setActiveView("work");
              addLine(
                "system",
                `Viewing project ${num}: ${projectsData[num - 1].title}`
              );
              break;
            }
          }

          const match = projectsData.find((project) =>
            cmd.includes(project.title.toLowerCase().replace(/\s+/g, ""))
          );
          if (match) {
            setActiveView("work");
            addLine("work");
            addLine(
              "system",
              `Viewing project ${projectsData.indexOf(match) + 1}: ${match.title}`
            );
            break;
          }

          setActiveView("terminal");
          addLine(
            "error",
            `Command not recognized: "${trimmed}". Type /help for available commands.`
          );
      }
    },
    [addLine, getNextId]
  );

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      if (isProcessingRef.current) {
        commandQueueRef.current.push(trimmed);
        return;
      }

      isProcessingRef.current = true;
      processCommand(trimmed);
    },
    [processCommand]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  if (windowState === "closed") {
    return <TerminatedScreen onReopen={() => setWindowState("open")} />;
  }

  if (windowState === "minimized") {
    return (
      <button
        type="button"
        className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-lg border border-zinc-700 bg-[#161b22] px-4 py-3 text-left"
        onClick={() => setWindowState("open")}
        aria-label="Restore terminal"
      >
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="text-xs text-zinc-400">Terminal minimized</span>
        <span className="ml-auto text-xs text-zinc-500">click to restore</span>
      </button>
    );
  }

  const isMaximized = windowState === "maximized";

  return (
    <div
      className={`mx-auto flex w-full flex-col overflow-hidden rounded-lg border border-zinc-700 bg-[#0d1117] shadow-2xl transition-all duration-300 ease-out ${
        isMaximized
          ? "fixed inset-0 z-50 h-[100dvh] w-[100dvw] rounded-none border-0"
          : "h-[100dvh] max-w-4xl sm:h-[80vh]"
      }`}
      onClick={focusInput}
    >
      {/* Dominant Pixelated Header */}
      <div className="flex-shrink-0 border-b border-zinc-800 bg-[#0d1117] px-4 py-3 sm:px-6 sm:py-4">
        <p className="pixel-name pixel-name--hero text-center sm:text-left">
          Gustavo Calderon Tenorio
        </p>
        <p className="pixel-subtitle mt-1 text-center sm:text-left">
          AI-Augmented Developer
        </p>
      </div>

      <TerminalHeader
        isMaximized={isMaximized}
        onClose={() => setWindowState("closed")}
        onMinimize={() => setWindowState("minimized")}
        onMaximize={() =>
          setWindowState(isMaximized ? "open" : "maximized")
        }
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TerminalOutput ref={outputRef} lines={outputLines} pendingCommand={pendingCommand} />
        <div className="flex-shrink-0 px-3 pb-3 sm:px-6">
          <CommandBar
            onCommand={(cmd) => {
              executeCommand(cmd);
              focusInput();
            }}
            currentView={activeView}
            pendingCommand={pendingCommand}
          />
        </div>
        <TerminalInput
          ref={inputRef}
          history={commandHistory}
          onSubmit={executeCommand}
          placeholder="Type a command... (try /help or Tab)"
        />
      </div>
    </div>
  );
}
