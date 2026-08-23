"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { TerminalHeader } from "./TerminalHeader";
import { TerminalOutput } from "./TerminalOutput";
import { TerminalInput } from "./TerminalInput";
import { CommandBar } from "./CommandBar";
import {
  helpText,
  welcomeMessage,
  projectsData,
  aboutContent,
  contactContent,
} from "@/lib/data";

export type OutputLine = {
  id: number;
  type: "system" | "command" | "response" | "error" | "project";
  content: string;
  projectIndex?: number;
};

export type ActiveView = "terminal" | "about" | "work" | "contact";

export default function CliShell() {
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>("terminal");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineCounter = useRef(0);

  const getNextId = useCallback(() => {
    lineCounter.current += 1;
    return lineCounter.current;
  }, []);

  const addLine = useCallback(
    (type: OutputLine["type"], content: string, projectIndex?: number) => {
      setOutputLines((prev) => [
        ...prev,
        { id: getNextId(), type, content, projectIndex },
      ]);
    },
    [getNextId]
  );

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [outputLines, scrollToBottom]);

  // Show welcome message on first mount
  useEffect(() => {
    setOutputLines([
      { id: getNextId(), type: "system", content: welcomeMessage },
    ]);
  }, [getNextId]);

  const executeCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      addLine("command", `$ ${trimmed}`);
      setCommandHistory((prev) => [trimmed, ...prev]);
      setHistoryIndex(-1);

      const cmd = trimmed.toLowerCase();

      switch (cmd) {
        case "/help":
        case "help":
          setActiveView("terminal");
          addLine("system", helpText);
          break;

        case "/about":
        case "about":
          setActiveView("about");
          break;

        case "/work":
        case "work":
        case "/projects":
        case "projects":
          setActiveView("work");
          break;

        case "/contact":
        case "contact":
          setActiveView("contact");
          break;

        case "/github":
        case "github":
          addLine(
            "system",
            `Opening GitHub → ${contactContent.github}`
          );
          window.open(contactContent.github, "_blank", "noopener,noreferrer");
          break;

        case "/linkedin":
        case "linkedin":
          addLine(
            "system",
            `Opening LinkedIn → ${contactContent.linkedin}`
          );
          window.open(
            contactContent.linkedin,
            "_blank",
            "noopener,noreferrer"
          );
          break;

        case "/clear":
        case "clear":
        case "cls":
          setOutputLines([]);
          setActiveView("terminal");
          break;

        default: {
          // Check if it's a project command like /work 1 or project name
          if (cmd.startsWith("/work ") || cmd.startsWith("work ")) {
            const num = parseInt(cmd.replace(/\/?work\s+/, ""), 10);
            if (num >= 1 && num <= projectsData.length) {
              setActiveView("work");
              addLine(
                "system",
                `Viewing project ${num}: ${projectsData[num - 1].title}`
              );
              break;
            }
          }

          // Try to match a project name
          const match = projectsData.find((p) =>
            cmd.includes(p.title.toLowerCase().replace(/\s+/g, ""))
          );
          if (match) {
            setActiveView("work");
            const idx = projectsData.indexOf(match);
            addLine(
              "system",
              `Viewing project ${idx + 1}: ${match.title}`
            );
            break;
          }

          setActiveView("terminal");
          addLine(
            "error",
            `Command not recognized: "${trimmed}". Type /help for available commands.`
          );
        }
      }
    },
    [addLine]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          e.currentTarget.value = commandHistory[newIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          e.currentTarget.value = commandHistory[newIndex];
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          e.currentTarget.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        // Simple autocomplete: find matching commands
        const val = e.currentTarget.value.toLowerCase();
        const commands = [
          "/help",
          "/about",
          "/work",
          "/contact",
          "/github",
          "/linkedin",
          "/clear",
        ];
        const match = commands.find((c) => c.startsWith(val) && c !== val);
        if (match) {
          e.currentTarget.value = match;
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(e.currentTarget.value);
        e.currentTarget.value = "";
      }
    },
    [commandHistory, historyIndex, executeCommand]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="w-full max-w-4xl mx-auto flex flex-col h-[85vh] sm:h-[80vh] rounded-lg overflow-hidden border border-zinc-700 bg-[#0d1117] shadow-2xl"
      onClick={focusInput}
    >
      <TerminalHeader />
      <div className="flex flex-col flex-1 min-h-0">
        <TerminalOutput ref={outputRef} lines={outputLines} />

        {activeView === "about" && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
            <div className="mb-4">
              <p className="text-green-400 font-bold text-lg">{aboutContent.name}</p>
              <p className="text-cyan-400 text-sm">{aboutContent.role}</p>
              <p className="text-zinc-300 mt-3 leading-relaxed">{aboutContent.intro}</p>
              <p className="text-zinc-400 mt-2 text-sm italic">{aboutContent.evidence}</p>
              <p className="text-cyan-300 mt-2 text-sm">{aboutContent.availability}</p>
            </div>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm">
              {aboutContent.body}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <CommandBar
                onCommand={(cmd) => {
                  executeCommand(cmd);
                  focusInput();
                }}
                currentView={activeView}
              />
            </div>
          </div>
        )}

        {activeView === "work" && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
            <p className="text-zinc-500 text-xs mb-3 uppercase tracking-wider">
              Projects — {projectsData.length} deployed applications
            </p>
            <div className="space-y-6">
              {projectsData.map((project, index) => (
                <div
                  key={project.id}
                  className="border border-zinc-800 rounded-md p-4 bg-[#161b22]"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-zinc-500 text-xs">#{index + 1}</span>
                      <h3 className="text-green-400 font-bold text-base inline ml-2">
                        {project.title}
                      </h3>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                    {project.problem.split("\n\n")[0]}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <blockquote className="text-zinc-500 text-xs italic border-l-2 border-zinc-700 pl-3 mb-3">
                    &quot;{project.directorsNote}&quot;
                  </blockquote>
                  <div className="flex gap-3 text-xs">
                    <a
                      href={project.liveSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                    >
                      Live Demo →
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <CommandBar
                onCommand={(cmd) => {
                  executeCommand(cmd);
                  focusInput();
                }}
                currentView={activeView}
              />
            </div>
          </div>
        )}

        {activeView === "contact" && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
            <p className="text-zinc-500 text-xs mb-4 uppercase tracking-wider">
              Contact
            </p>
            <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
              If you need a web application built, deployed, and explained —
              let&apos;s talk.
            </p>
            <div className="space-y-3">
              <a
                href={`mailto:${contactContent.email}`}
                className="flex items-center gap-3 text-sm text-zinc-300 hover:text-green-400 transition-colors group"
              >
                <span className="text-zinc-500 group-hover:text-green-400">
                  ✉
                </span>
                <span className="underline underline-offset-2">
                  {contactContent.email}
                </span>
              </a>
              <a
                href={contactContent.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-zinc-300 hover:text-cyan-400 transition-colors group"
              >
                <span className="text-zinc-500 group-hover:text-cyan-400">
                  in
                </span>
                <span className="underline underline-offset-2">
                  linkedin.com/in/gustavo-calderon-tenorio-530049369
                </span>
              </a>
              <a
                href={contactContent.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-zinc-300 hover:text-cyan-400 transition-colors group"
              >
                <span className="text-zinc-500 group-hover:text-cyan-400">
                  ⌥
                </span>
                <span className="underline underline-offset-2">
                  github.com/Gustav-DEVhub
                </span>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <CommandBar
                onCommand={(cmd) => {
                  executeCommand(cmd);
                  focusInput();
                }}
                currentView={activeView}
              />
            </div>
          </div>
        )}

        {activeView === "terminal" && (
          <div className="px-4 sm:px-6 pb-4">
            <CommandBar
              onCommand={(cmd) => {
                executeCommand(cmd);
                focusInput();
              }}
              currentView={activeView}
            />
          </div>
        )}

        <TerminalInput
          ref={inputRef}
          onKeyDown={handleKeyDown}
          placeholder="Type a command... (try /help)"
        />
      </div>
    </div>
  );
}
