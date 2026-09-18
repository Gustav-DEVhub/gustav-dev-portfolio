"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TerminalHeader } from "./TerminalHeader";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput } from "./TerminalOutput";
import { TerminatedScreen } from "./TerminatedScreen";
import { normalizeCommand } from "@/lib/commands";
import {
  contactContent,
  helpHeader,
  helpText,
  projectsData,
} from "@/lib/data";

export type ActiveView = "terminal" | "about" | "work" | "contact";
type WindowState = "open" | "minimized" | "maximized" | "closed";

export type ThemeId = "dark" | "retro" | "solarized";

export type OutputLine = {
  id: number;
  type:
    | "hero"
    | "system"
    | "helpHeader"
    | "command"
    | "response"
    | "error"
    | "about"
    | "work"
    | "contact"
    | "loading"
    | "github"
    | "linkedin"
    | "skills"
    | "themes";
  content: string;
};

const LOADER_DURATION = 1300;
const LOADING_VERBS = [
  'Compiling',
  'Loading',
  'Querying',
  'Rendering',
  'Parsing',
  'Resolving',
];

export default function CliShell() {
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>("terminal");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [windowState, setWindowState] = useState<WindowState>("open");
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeId>("dark");
  // Phase 2l.2 — transient flag for the open <-> maximized scale pop. Kept
  // separate from `windowState` on purpose so it never gates existing logic.
  const [isResizePopping, setIsResizePopping] = useState(false);
  // Phase 2l.3 — exit animation. Non-null while a close/minimize request is
  // playing .window-exit for 180ms, before the real windowState change commits.
  const [pendingExit, setPendingExit] = useState<{
    target: "closed" | "minimized";
    originClass: "window-exit-to-close" | "window-exit-to-minimize";
  } | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const minimizedBarRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(0);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resizePopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    
  }, []);



  const scrollToTop = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = 0;
    }
  }, []);



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
      if (resizePopTimerRef.current) {
        clearTimeout(resizePopTimerRef.current);
        resizePopTimerRef.current = null;
      }
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [clearLoadingState]);

  // Phase 2g — instant (non-animated) auto-scroll to bottom on command submit.
  // Direct scrollTop/scrollHeight assignment: synchronous, no smooth/animated
  // transition, no timeout, no output-length or animation-completion coupling.
  // Fires on every submission and after deferred output lines resolve, so the
  // view always lands on the newest content. Reuses the existing outputRef
  // (the TerminalOutput history container), and is independent of the
  // suggestion menu's scroll-follow (SuggestionMenu owns its own listRef).
  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  // Phase 2g — commit-time companion to the submit-time scrollToBottom call:
  // the DOM updates after React commits the new lines (including deferred
  // command output), so scrollHeight only reflects the newest content here.
  // Keyed off the lines array per spec; performs a direct, instant assignment
  // synchronously once triggered — no smooth/animated scroll, no timeout.
  useEffect(() => {
    scrollToBottom();
  }, [outputLines, scrollToBottom]);

  const processCommand = useCallback(
    (trimmed: string) => {
      setCommandHistory((prev) => [...prev, trimmed]);
      addLine("command", trimmed);
      scrollToBottom();

      const cmd = normalizeCommand(trimmed);

      switch (cmd) {
        case "/help": {
          const verb = LOADING_VERBS[Math.floor(Math.random() * LOADING_VERBS.length)];
          setPendingCommand(verb);
          clearLoadingState();
          loadingTimerRef.current = setTimeout(() => {
            addLine("helpHeader", helpHeader);
            addLine("system", helpText);
            setPendingCommand(null);
            
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break; }

        case "/about": {
          const verb = LOADING_VERBS[Math.floor(Math.random() * LOADING_VERBS.length)];
          setPendingCommand(verb);
          clearLoadingState();
          loadingTimerRef.current = setTimeout(() => {
            addLine("about");
            setPendingCommand(null);

            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break; }

        case "/skills": {
          const verb = LOADING_VERBS[Math.floor(Math.random() * LOADING_VERBS.length)];
          setPendingCommand(verb);
          clearLoadingState();
          loadingTimerRef.current = setTimeout(() => {
            addLine("skills");
            setPendingCommand(null);

            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break; }

        case "/work": {
          const verb = LOADING_VERBS[Math.floor(Math.random() * LOADING_VERBS.length)];
          setPendingCommand(verb);
          clearLoadingState();
          loadingTimerRef.current = setTimeout(() => {
            addLine("work");
            setActiveView("work");
            addLine("system", `${projectsData.length} projects loaded.`);
            setPendingCommand(null);
            
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break; }

        case "/contact": {
          const verb = LOADING_VERBS[Math.floor(Math.random() * LOADING_VERBS.length)];
          setPendingCommand(verb);
          clearLoadingState();
          loadingTimerRef.current = setTimeout(() => {
            addLine("contact");
            setPendingCommand(null);
            
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break; }

        case "/github": {
          const verb = LOADING_VERBS[Math.floor(Math.random() * LOADING_VERBS.length)];
          setPendingCommand(verb);
          clearLoadingState();
          loadingTimerRef.current = setTimeout(() => {
            addLine(
              "github",
              contactContent.github
            );
            setPendingCommand(null);
            
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break; }

        case "/linkedin": {
          const verb = LOADING_VERBS[Math.floor(Math.random() * LOADING_VERBS.length)];
          setPendingCommand(verb);
          clearLoadingState();
          loadingTimerRef.current = setTimeout(() => {
            addLine(
              "linkedin",
              contactContent.linkedin
            );
            setPendingCommand(null);
            
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            } else {
              isProcessingRef.current = false;
            }
          }, LOADER_DURATION);
          break; }

        case "/themes":
          clearLoadingState();
          setPendingCommand(null);
          addLine("themes");
          isProcessingRef.current = false;
          if (commandQueueRef.current.length > 0) {
            const next = commandQueueRef.current.shift()!;
            processCommandRef.current?.(next);
          }
          break;

        case "/dark":
          clearLoadingState();
          setPendingCommand(null);
          setTheme("dark");
          addLine("system", "Theme set to Dark.");
          isProcessingRef.current = false;
          if (commandQueueRef.current.length > 0) {
            const next = commandQueueRef.current.shift()!;
            processCommandRef.current?.(next);
          }
          break;

        case "/retro":
          clearLoadingState();
          setPendingCommand(null);
          setTheme("retro");
          addLine("system", "Theme set to Retro CRT.");
          isProcessingRef.current = false;
          if (commandQueueRef.current.length > 0) {
            const next = commandQueueRef.current.shift()!;
            processCommandRef.current?.(next);
          }
          break;

        case "/solarized":
          clearLoadingState();
          setPendingCommand(null);
          setTheme("solarized");
          addLine("system", "Theme set to Solarized Dark.");
          isProcessingRef.current = false;
          if (commandQueueRef.current.length > 0) {
            const next = commandQueueRef.current.shift()!;
            processCommandRef.current?.(next);
          }
          break;

        case "/clear":
          clearLoadingState();
          setPendingCommand(null);
          setOutputLines([{ id: getNextId(), type: "hero", content: "" }]);
          isProcessingRef.current = false;
          if (commandQueueRef.current.length > 0) {
            const next = commandQueueRef.current.shift()!;
            processCommandRef.current?.(next);
          }
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
              clearLoadingState();
              isProcessingRef.current = false;
              if (commandQueueRef.current.length > 0) {
                const next = commandQueueRef.current.shift()!;
                processCommandRef.current?.(next);
              }
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
            clearLoadingState();
            isProcessingRef.current = false;
            if (commandQueueRef.current.length > 0) {
              const next = commandQueueRef.current.shift()!;
              processCommandRef.current?.(next);
            }
            break;
          }

          setActiveView("terminal");
          addLine(
            "error",
            `Command not recognized: "${trimmed}". Type /help for available commands.`
          );
          clearLoadingState();
          isProcessingRef.current = false;
          if (commandQueueRef.current.length > 0) {
            const next = commandQueueRef.current.shift()!;
            processCommandRef.current?.(next);
          }
      }
    },
    [addLine, getNextId, clearLoadingState, scrollToBottom]
  );

  // Keep processCommandRef in sync with the latest processCommand function

  useEffect(() => {
    processCommandRef.current = processCommand;
  }, [processCommand]);

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

  // Phase 2l.3 — deferred exit. Closing/minimizing first marks a pending exit so
  // the still-mounted root can play .window-exit for 180ms (matching the CSS
  // transition), then commits the real windowState change and clears the flag.
  // The `pendingExit` guard drops any request made while one is already playing:
  // React flushes this state update before the next click event runs, so the
  // handler invoked by a rapid second click already sees the non-null value.
  // The pre-existing timer is cleared defensively, mirroring loadingTimerRef.
  const requestExit = (
    target: "closed" | "minimized",
    originClass: "window-exit-to-close" | "window-exit-to-minimize"
  ) => {
    if (pendingExit) return;

    setPendingExit({ target, originClass });

    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setWindowState(target);
      setPendingExit(null);
      exitTimerRef.current = null;
    }, 180);
  };

  // Phase 2j.3 — while minimized, clicking anywhere outside the minimized bar
  // focuses the compact TerminalInput's input (focus only — it must NOT
  // restore/expand). The document listener is attached only while
  // windowState === "minimized" and removed on unmount or on any state
  // change, so expanded/maximized/closed states get no new click behavior.
  // Clicks inside the bar are ignored here — restoring is now handled solely
  // by the bar's own traffic-light buttons (red/yellow/green), which stop
  // propagation themselves.
  useEffect(() => {
    if (windowState !== "minimized") return;
    const handleDocumentClick = (event: MouseEvent) => {
      const bar = minimizedBarRef.current;
      if (!bar) return;
      if (bar.contains(event.target as Node)) return;
      focusInput();
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [windowState, focusInput]);

  if (windowState === "closed") {
    return <TerminatedScreen onReopen={() => setWindowState("open")} />;
  }

  if (windowState === "minimized") {
    return (
      <div
        ref={minimizedBarRef}
        className={`mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-lg border border-[var(--window-border)] bg-[var(--window-bg)] px-4 py-3 ${
          pendingExit ? `window-exit ${pendingExit.originClass}` : ""
        }`}
      >
        {/* Row 1 — window controls + prompt. Only the colored buttons restore:
            red closes (same flow as the open header), yellow opens floating,
            green opens fullscreen. The bar body itself no longer restores. */}
        <div className="flex items-center gap-2">
          <div className="mr-1 flex items-center gap-1 sm:mr-3 sm:gap-2">
            <button
              type="button"
              aria-label="Close terminal"
              title="Close"
              className="flex h-11 w-11 items-center justify-center sm:h-auto sm:w-auto"
              onClick={(event) => {
                event.stopPropagation();
                requestExit("closed", "window-exit-to-close");
              }}
            >
              <span className="h-3.5 w-3.5 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.55)] hover:brightness-110 sm:h-3 sm:w-3" />
            </button>
            <button
              type="button"
              aria-label="Restore terminal"
              title="Restore"
              className="flex h-11 w-11 items-center justify-center sm:h-auto sm:w-auto"
              onClick={(event) => {
                event.stopPropagation();
                setWindowState("open");
              }}
            >
              <span className="h-3.5 w-3.5 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.45)] hover:brightness-110 sm:h-3 sm:w-3" />
            </button>
            <button
              type="button"
              aria-label="Maximize terminal"
              title="Maximize"
              className="flex h-11 w-11 items-center justify-center sm:h-auto sm:w-auto"
              onClick={(event) => {
                event.stopPropagation();
                setWindowState("maximized");
              }}
            >
              <span className="h-3.5 w-3.5 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.45)] hover:brightness-110 sm:h-3 sm:w-3" />
            </button>
          </div>
          <p className="hidden text-[10px] tracking-wide text-zinc-500 sm:block">
            gustav@tenorio ~ /portfolio
          </p>
        </div>

        {/* Row 2 — shared compact TerminalInput, unchanged (Enter still expands
            and executes in one action via its own submit path). */}
        <div className="min-w-0 flex-1" onClick={(event) => event.stopPropagation()}>
          <TerminalInput
            ref={inputRef}
            history={commandHistory}
            value={inputValue}
            onChange={setInputValue}
            onSubmit={(command) => {
              setWindowState("open");
              executeCommand(command);
            }}
            placeholder="Type a command... (try /help or Tab)"
            compact
          />
        </div>
      </div>
    );
  }

  const isMaximized = windowState === "maximized";

  return (
    <div
      data-theme={theme === "dark" ? undefined : theme}
      className={`window-enter mx-auto flex w-full flex-col overflow-hidden rounded-lg border border-[var(--window-border)] bg-[var(--window-bg)] shadow-2xl ${
        isResizePopping ? "window-resize-pop " : ""
      }${pendingExit ? `window-exit ${pendingExit.originClass} ` : ""}${
        isMaximized
          ? "fixed inset-0 z-50 h-[100dvh] w-[100dvw] rounded-none border-0"
          : "min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] max-h-[90vh] max-w-5xl w-full min-w-0"
      }`}
      onClick={focusInput}
    >
      {/* Dominant Pixelated Header */}
      <div className="flex-shrink-0 border-b border-zinc-800 bg-[#0d1117] px-4 py-3 sm:px-6 sm:py-4">
        <p className="pixel-name pixel-name--hero pixel-name--accent text-center sm:text-left">
          Gustav Calderon Tenorio
        </p>
        <p className="pixel-subtitle pixel-subtitle--accent mt-1 text-center sm:text-left">
          AI-Augmented Developer
        </p>
      </div>

      <TerminalHeader
        isMaximized={isMaximized}
        onClose={() => requestExit("closed", "window-exit-to-close")}
        onMinimize={() => requestExit("minimized", "window-exit-to-minimize")}
        onMaximize={() => {
          setWindowState(isMaximized ? "open" : "maximized");
          setIsResizePopping(true);
          if (resizePopTimerRef.current) clearTimeout(resizePopTimerRef.current);
          resizePopTimerRef.current = setTimeout(() => {
            setIsResizePopping(false);
            resizePopTimerRef.current = null;
          }, 150);
        }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TerminalOutput
          ref={outputRef}
          lines={outputLines}
          pendingCommand={pendingCommand}
          activeTheme={theme}
          onSelectTheme={setTheme}
        />

        <TerminalInput
          ref={inputRef}
          history={commandHistory}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={executeCommand}
          placeholder="Type a command... (try /help or Tab)"
        />
      </div>
    </div>
  );
}
