"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { aboutContent, contactContent, projectsData } from "@/lib/data";

import type { OutputLine } from "./CliShell";

interface TerminalOutputProps {
  lines: OutputLine[];
  pendingCommand?: string | null;
}

export const TerminalOutput = forwardRef<HTMLDivElement, TerminalOutputProps>(
  function TerminalOutput({ lines, pendingCommand }, ref) {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto overscroll-contain px-4 pb-2 pt-4 sm:px-6">
        {lines.map((line) => (
          <div key={line.id} className="mb-2">
            {line.type === "hero" && <HeroBlock />}
            {line.type === "command" && <p className="text-sm text-[var(--accent-violet)]"><span className="select-none text-zinc-500">$ </span><span>{line.content}</span></p>}
            {line.type === "system" && <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{line.content}</pre>}
            {line.type === "response" && <p className="text-sm leading-relaxed text-zinc-300">{line.content}</p>}
            {line.type === "error" && <p className="text-sm text-red-400">{line.content}</p>}
            {line.type === "about" && <AboutBlock />}
            {line.type === "work" && <WorkBlock />}
            {line.type === "contact" && <ContactBlock />}
          </div>
        ))}
        {pendingCommand && (
          <div className="mb-2 loading-line">
            <p className="text-sm text-[var(--accent-violet)]">
              <span className="loading-dots inline-flex">
                <span>{(["/help", "/about", "/work", "/contact", "/github", "/linkedin"].includes(pendingCommand) ? pendingCommand.replace("/", "Loading ") : "Processing")}</span>
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
    <div className="mb-5 border-b border-zinc-800/80 pb-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-md border border-zinc-800 bg-[#161b22] p-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-400">Build</p>
          <p className="text-sm leading-relaxed text-zinc-300">Functional web applications built with React, TypeScript, and deployed to production.</p>
        </div>
        <div className="rounded-md border border-zinc-800 bg-[#161b22] p-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-400">Stack</p>
          <p className="text-sm leading-relaxed text-zinc-300">React, TypeScript, Next.js, Node.js, Express, Tailwind, Vercel, and more.</p>
        </div>
        <div className="rounded-md border border-zinc-800 bg-[#161b22] p-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-400">Ship</p>
          <p className="text-sm leading-relaxed text-zinc-300">End-to-end: from architecture to live demos, public repos, and explainable decisions.</p>
        </div>
        <div className="rounded-md border border-zinc-800 bg-[#161b22] p-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-400">Status</p>
          <p className="text-sm leading-relaxed text-zinc-300">Open to junior roles and freelance web development projects.</p>
        </div>
      </div>
    </div>
  );
}
function AboutBlock() {
  return (
    <div className="mb-2">
      <p className="pixel-name text-sm sm:text-base">{aboutContent.name}</p>
      <p className="text-sm text-[var(--accent-violet)]">{aboutContent.role}</p>
      <p className="mt-3 leading-relaxed text-zinc-300">{aboutContent.intro}</p>
      <p className="mt-2 text-sm italic text-zinc-400">{aboutContent.evidence}</p>
      <p className="mt-2 text-sm text-[var(--accent-violet)]">{aboutContent.availability}</p>
      <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-300">{aboutContent.body}</div>
    </div>
  );
}

function WorkBlock() {
  return (
    <div className="mb-2">
      <p className="mb-3 text-xs uppercase tracking-wider text-zinc-400">Projects - {projectsData.length} deployed applications</p>
      <div className="space-y-8">
        {projectsData.map((project, index) => (
          <div key={project.id} className="rounded-md border border-zinc-700 bg-[#161b22] p-3">
            <div className="mb-4">
              <span className="text-xs text-zinc-400">#{index + 1}</span>
              <h3 className="ml-2 inline text-base font-bold text-[var(--accent-violet)]">{project.title}</h3>
              <p className="mt-0.5 text-xs text-zinc-400">{project.subtitle}</p>
            </div>
            <div className="mb-4">
              <p className="pixel-name mb-1.5 text-xs text-[var(--accent-violet)]">Problem</p>
              <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">{project.problem}</p>
            </div>
            <div className="mb-4">
              <p className="pixel-name mb-1.5 text-xs text-[var(--accent-violet)]">Process</p>
              <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">{project.process}</p>
            </div>
            <div className="mb-4">
              <p className="pixel-name mb-1.5 text-xs text-[var(--accent-violet)]">Solution</p>
              <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">{project.solution}</p>
            </div>
            <div className="mb-4">
              <p className="pixel-name mb-1 text-xs text-zinc-500">Technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-sm bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">{tech}</span>
                ))}
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-3 text-sm">
              <a href={project.liveSite} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">Live Site</a>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">GitHub</a>
            </div>
            <div className="border-t border-zinc-800 pt-3">
              <p className="pixel-name mb-1.5 text-xs text-zinc-500">Director&apos;s Note</p>
              <p className="text-sm italic text-zinc-400">&ldquo;{project.directorsNote}&rdquo;</p>
            </div>

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="border-t border-zinc-800 pt-3">
                <p className="pixel-name mb-2 text-xs text-zinc-400">Screenshots</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {project.screenshots.map((screenshot, idx) => (
                    <div key={idx} className="relative aspect-video overflow-hidden rounded border border-zinc-700 bg-zinc-900">
                      <Image
                        src={`/projects/${project.id}/${screenshot.filename}`}
                        alt={screenshot.description}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactBlock() {
  return (
    <div className="mb-2">
      <p className="mb-4 text-xs uppercase tracking-wider text-zinc-400">Contact</p>
      <p className="mb-4 text-sm leading-relaxed text-zinc-300">If you need a web application built, deployed, and explained - let us talk.</p>
      <div className="space-y-3">
        <a href={`mailto:${contactContent.email}`} className="group flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-[var(--accent-green)] focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] focus-visible:rounded-md">
          <span className="text-zinc-500 group-hover:text-[var(--accent-green)]">@</span>
          <span className="underline underline-offset-2">{contactContent.email}</span>
        </a>
        <a href={contactContent.linkedin} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-cyan-400 focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] focus-visible:rounded-md">
          <span className="text-zinc-500 group-hover:text-cyan-400">in</span>
          <span className="underline underline-offset-2">linkedin.com/in/gustavo-calderon-tenorio-530049369</span>
        </a>
        <a href={contactContent.github} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-sm text-zinc-300 transition-colors hover:text-cyan-400 focus-visible:ring-2 focus-visible:ring-[var(--accent-violet)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] focus-visible:rounded-md">
          <span className="text-zinc-500 group-hover:text-cyan-400">[GH]</span>
          <span className="underline underline-offset-2">github.com/Gustav-DEVhub</span>
        </a>
      </div>
    </div>
  );
}
