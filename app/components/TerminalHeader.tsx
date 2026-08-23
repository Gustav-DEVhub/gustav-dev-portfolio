"use client";

export function TerminalHeader() {
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-zinc-800 select-none">
      {/* Traffic light dots */}
      <div className="flex gap-2 mr-3">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57] opacity-80" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e] opacity-80" />
        <div className="w-3 h-3 rounded-full bg-[#28c840] opacity-80" />
      </div>
      <div className="flex-1 text-center">
        <span className="text-zinc-400 text-xs font-medium tracking-wide">
          gustavo@portfolio ~ % 
        </span>
      </div>
      <div className="w-14" />
    </div>
  );
}
