"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { aboutContent, contactContent, projectsData, skillsContent } from "@/lib/data";

import type { OutputLine, ThemeId } from "./CliShell";

interface TerminalOutputProps {
  lines: OutputLine[];
  pendingCommand?: string | null;
  activeTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  function TerminalOutput({ lines, pendingCommand, activeTheme, onSelectTheme }, ref) {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-2 pt-4 sm:px-6">
        {lines.map((line) => (
          <div key={line.id} className="mb-2">
            {line.type === "hero" && <HeroBlock />}
            {line.type === "command" && <p className="text-sm text-[var(--accent-violet)]"><span className="select-none text-zinc-500">$ </span><span>{line.content}</span></p>}
            {line.type === "system" && <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--body-text)]">{line.content}</pre>}
            {line.type === "helpHeader" && <p className="text-sm font-bold text-[var(--accent-subtitle)]">{line.content}</p>}
            {line.type === "response" && <p className="text-sm leading-relaxed text-[var(--body-text)]">{line.content}</p>}
            {line.type === "error" && <p className="text-sm text-[var(--error-text)]">{line.content}</p>}
            {line.type === "about" && <AboutBlock />}
            {line.type === "work" && <WorkBlock />}
            {line.type === "contact" && <ContactBlock />}
            {line.type === "github" && <GithubBlock url={line.content} />}
            {line.type === "linkedin" && <LinkedinBlock url={line.content} />}
            {line.type === "skills" && <SkillsBlock />}
            {line.type === "themes" && <ThemesBlock activeTheme={activeTheme} onSelect={onSelectTheme} />}
          </div>
        ))}
        {pendingCommand && (
          <div className="mb-2 loading-line">
            <p className="text-sm text-[var(--accent-violet)] animate-pulse">
              <span className="loading-dots inline-flex">
                <span>&gt; {pendingCommand}</span>
                <span className="loading-dot" style={{ animationDelay: "0ms" }}>.</span>
                <span className="loading-dot" style={{ animationDelay: "200ms" }}>.</span>
                <span className="loading-dot" style={{ animationDelay: "400ms" }}>.</span>
              </span>
            </p>
          </div>
        )}
      </div>
    );
  }
);

function HeroBlock() {
  return (
    <div className="mb-5 space-y-6 border-b border-zinc-800/80 pb-5">
      {/* SYS:: CAPABILITIES */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-[var(--accent-green)]">SYS::</span>
          <span className="font-mono text-xs font-medium text-[var(--accent-subtitle)]">CAPABILITIES</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-subtitle)]">BUILD:</span>
            <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">
              Functional web applications built with React, TypeScript, and deployed to production.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-subtitle)]">STACK:</span>
            <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">
              React, TypeScript, Next.js, Node.js, Express, Tailwind, Vercel, and more.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-subtitle)]">SHIP:</span>
            <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">
              End-to-end: from architecture to live demos, public repos, and explainable decisions.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-subtitle)]">STATUS:</span>
            <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">
              Based in Peru (UTC-5) — Available for Remote Work. Open to junior roles and freelance web development projects.
            </p>
          </div>
        </div>
      </div>

      {/* CMD:: AVAILABLE COMMANDS */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-[var(--accent)]">CMD::</span>
          <span className="font-mono text-xs font-medium text-[var(--accent-subtitle)]">AVAILABLE COMMANDS</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/help</span>
            <span className="font-mono text-xs text-zinc-400">— Show available commands</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/about</span>
            <span className="font-mono text-xs text-zinc-400">— About Gustavo</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/skills</span>
            <span className="font-mono text-xs text-zinc-400">— Show skills and tools</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/work</span>
            <span className="font-mono text-xs text-zinc-400">— Explore selected projects</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/contact</span>
            <span className="font-mono text-xs text-zinc-400">— Contact information</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/github</span>
            <span className="font-mono text-xs text-zinc-400">— GitHub profile</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/linkedin</span>
            <span className="font-mono text-xs text-zinc-400">— LinkedIn profile</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/themes</span>
            <span className="font-mono text-xs text-zinc-400">— Change terminal theme</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">/clear</span>
            <span className="font-mono text-xs text-zinc-400">— Clear terminal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function AboutBlock() {
  return (
    <div className="mb-2">
      <h3 className="font-mono text-base font-bold text-[var(--accent-subtitle)]">
        About Gustavo Calderon Tenorio
      </h3>
      <p className="mt-3 leading-relaxed text-[var(--body-text)]">{aboutContent.intro}</p>
      <p className="mt-2 text-sm italic text-zinc-400">{aboutContent.evidence}</p>
      <p className="mt-2 text-sm text-[var(--accent-violet)]">
        <span className="font-mono text-[var(--accent-violet)]">Location: </span>
        {aboutContent.location}
      </p>
      <p className="mt-2 text-sm text-[var(--accent-violet)]">{aboutContent.availability}</p>
      {aboutContent.sections.map((section) => (
        <div key={section.subtitle} className="mt-4">
          <p className="text-sm font-bold text-[var(--accent-subtitle)]">{section.subtitle}</p>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-2 text-sm leading-relaxed text-[var(--body-text)]">
              {paragraph}
            </p>
          ))}
          {section.bullets.length > 0 && (
            <div className="mt-2 space-y-1">
              {section.bullets.map((bullet) => (
                <p key={bullet} className="text-sm text-[var(--accent-subtitle)]">
                  ◆ {bullet}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="mt-4">
        {aboutContent.closing.map((line) => (
          <p key={line} className="text-sm leading-relaxed text-[var(--body-text)]">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function SkillsBlock() {
  return (
    <div className="mb-2 space-y-5">
      {/* CAPABILITIES — mirrors the Hero "SYS:: CAPABILITIES" label style */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-[var(--accent-green)]">SYS::</span>
          <span className="font-mono text-xs font-medium text-[var(--accent-subtitle)]">CAPABILITIES</span>
        </div>
        <div className="space-y-2">
          {skillsContent.capabilities.map((item, idx) => (
            <div key={`skills-cap-${idx}`} className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-xs text-[var(--accent-violet)]">▸</span>
              <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TOOLS — uses the same monospaced label/divider pattern */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs font-medium text-[var(--accent)]">CMD::</span>
          <span className="font-mono text-xs font-medium text-[var(--accent-subtitle)]">TOOLS</span>
        </div>
        <div className="space-y-3">
          {Object.entries(skillsContent.tools).map(([category, items]) => (
            <div key={`skills-tools-${category}`} className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-xs text-[var(--accent-subtitle)]">
                {category}:
              </span>
              <p className="whitespace-pre-line font-mono text-xs leading-relaxed text-[var(--body-text)]">
                {items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkBlock() {
  return (
    <div className="mb-2">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-zinc-400">Projects — {projectsData.length} deployed applications</p>
      <div className="space-y-10">
        {projectsData.map((project, index) => (
          <article key={project.id} className="space-y-5">
            {/* Project header with thin divider */}
            <header className="space-y-2 border-b border-zinc-800/60 pb-3">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-zinc-500">#{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-mono text-base font-bold text-[var(--accent-subtitle)]">{project.title}</h3>
              </div>
              <p className="font-mono text-xs text-zinc-500">{project.subtitle}</p>
            </header>

            {/* PROBLEM */}
            <section>
              <h4 className="mb-1.5 font-mono text-xs font-bold tracking-wider text-[var(--accent-subtitle)]">PROBLEM:</h4>
              <p className="font-mono text-sm leading-relaxed text-[var(--body-text)] whitespace-pre-line">{project.problem}</p>
            </section>

            {/* PROCESS */}
            <section>
              <h4 className="mb-1.5 font-mono text-xs font-bold tracking-wider text-[var(--accent-subtitle)]">PROCESS:</h4>
              <p className="font-mono text-sm leading-relaxed text-[var(--body-text)] whitespace-pre-line">{project.process}</p>
            </section>

            {/* SOLUTION */}
            <section>
              <h4 className="mb-1.5 font-mono text-xs font-bold tracking-wider text-[var(--accent-subtitle)]">SOLUTION:</h4>
              <p className="font-mono text-sm leading-relaxed text-[var(--body-text)] whitespace-pre-line">{project.solution}</p>
            </section>

            {/* TECHNOLOGIES */}
            <section>
              <h4 className="mb-2 font-mono text-xs font-bold tracking-wider text-[var(--accent-subtitle)]">TECHNOLOGIES:</h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono rounded-sm border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-0.5 text-xs text-[var(--body-text)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* INTERACTIVE LINKS as capsule pills */}
            {(project.liveSite || project.github) && (
              <section>
                <h4 className="mb-2 font-mono text-xs font-bold tracking-wider text-[var(--accent-subtitle)]">LINKS:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.liveSite && (
                    <a
                      href={project.liveSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded border border-zinc-700/60 bg-zinc-900/40 px-3 py-1.5 font-mono text-xs text-zinc-200 transition-colors hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                    >
                      <span>[ LIVE DEMO</span>
                      <span aria-hidden="true">→</span>
                      <span>]</span>
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded border border-zinc-700/60 bg-zinc-900/40 px-3 py-1.5 font-mono text-xs text-zinc-200 transition-colors hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                    >
                      <span>[ REPO</span>
                      <span aria-hidden="true">→</span>
                      <span>]</span>
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* DIRECTOR'S NOTE */}
            {project.directorsNote && (
              <section>
                <h4 className="mb-1.5 font-mono text-xs font-bold tracking-wider text-[var(--accent-subtitle)]">
                  DIRECTOR&apos;S NOTE:
                </h4>
                <blockquote className="border-l-2 border-[var(--accent-violet)]/30 pl-3 font-mono text-xs italic leading-relaxed text-zinc-400">
                  &ldquo;{project.directorsNote}&rdquo;
                </blockquote>
              </section>
            )}

            {/* SCREENSHOTS — independent framed visual blocks */}
            {project.screenshots && project.screenshots.length > 0 && (
              <section>
                <h4 className="mb-2 font-mono text-xs font-bold tracking-wider text-[var(--accent-subtitle)]">SCREENSHOTS:</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {project.screenshots.map((screenshot, idx) => (
                    <figure
                      key={idx}
                      className="overflow-hidden rounded border border-zinc-800/80 bg-zinc-900/60"
                    >
                      <div className="relative aspect-video w-full">
                        <Image
                          src={`/projects/${project.id}/${screenshot.filename}`}
                          alt={screenshot.description}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      {screenshot.description && (
                        <figcaption className="border-t border-zinc-800/60 px-2 py-1.5 font-mono text-[10px] leading-snug text-zinc-500">
                          {screenshot.description}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* Thin separator between projects (except last) */}
            {index < projectsData.length - 1 && (
              <div
                aria-hidden="true"
                className="h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function ContactBlock() {
  return (
    <div className="mb-2">
      <p className="mb-4 text-xs uppercase tracking-wider text-zinc-400">Contact</p>
      <p className="mb-4 text-sm leading-relaxed text-[var(--body-text)]">If you need a web application built, deployed, and explained - let us talk.</p>
      <div className="space-y-3">
        <a href={`mailto:${contactContent.email}`} className="group flex items-center gap-3 text-sm text-[var(--body-text)] transition-colors hover:text-[var(--accent-green)] focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] focus-visible:rounded-md">
          <span className="text-zinc-500 group-hover:text-[var(--accent-green)]">@</span>
          <span className="underline underline-offset-2">{contactContent.email}</span>
        </a>
        <a href={contactContent.linkedin} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm text-[var(--body-text)] transition-colors hover:text-cyan-400 focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] focus-visible:rounded-md">
          <span className="text-zinc-500 group-hover:text-cyan-400">in</span>
          <span className="underline underline-offset-2">linkedin.com/in/gustavo-calderon-tenorio-530049369</span>
        </a>
        <a href={contactContent.github} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm text-[var(--body-text)] transition-colors hover:text-cyan-400 focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] focus-visible:rounded-md">
          <span className="text-zinc-500 group-hover:text-cyan-400">[GH]</span>
          <span className="underline underline-offset-2">github.com/Gustav-DEVhub</span>
        </a>
      </div>
    </div>
  );
}

function GithubBlock({ url }: { url: string }) {
  return (
    <div className="mb-2 space-y-3">
      <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">
        Explore my repositories, contributions, and open source work on GitHub.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded border border-zinc-700/60 bg-zinc-900/40 px-3 py-1.5 font-mono text-xs text-zinc-200 transition-colors hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
      >
        <span>[ VIEW GITHUB</span>
        <span aria-hidden="true">→</span>
        <span>]</span>
      </a>
    </div>
  );
}

function LinkedinBlock({ url }: { url: string }) {
  return (
    <div className="mb-2 space-y-3">
      <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">
        Connect with me on LinkedIn to view my professional experience and network.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded border border-zinc-700/60 bg-zinc-900/40 px-3 py-1.5 font-mono text-xs text-zinc-200 transition-colors hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
      >
        <span>[ VIEW LINKEDIN</span>
        <span aria-hidden="true">→</span>
        <span>]</span>
      </a>
    </div>
  );
}

const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "retro", label: "Retro CRT" },
  { id: "solarized", label: "Solarized Dark" },
];

function ThemesBlock({
  activeTheme,
  onSelect,
}: {
  activeTheme: ThemeId;
  onSelect: (theme: ThemeId) => void;
}) {
  return (
    <div className="mb-2 space-y-2">
      <p className="font-mono text-xs leading-relaxed text-[var(--body-text)]">
        Select a terminal theme:
      </p>
      {THEME_OPTIONS.map(({ id, label }) => {
        const isActive = activeTheme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`inline-flex w-full items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 ${
              isActive
                ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                : "border-zinc-700/60 bg-zinc-900/40 text-zinc-200 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300"
            }`}
          >
            <span>[ {label}</span>
            {isActive ? (
              <span className="text-[var(--accent-green)]">● active</span>
            ) : (
              <span aria-hidden="true">→</span>
            )}
            <span>]</span>
          </button>
        );
      })}
    </div>
  );
}
