import CliShell from "@/app/components/CliShell";

export default function Home() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--accent-violet)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-violet)] focus:ring-offset-2 focus:ring-offset-black"
      >
        Skip to main content
      </a>

      <header className="sr-only">
        <h1>Gustavo Portfolio</h1>
      </header>

      <main id="main-content" className="flex h-[100dvh] w-[100dvw] items-start justify-center overflow-hidden bg-black">
        <CliShell />
      </main>

      <footer className="sr-only">
        <p>Portfolio by Gustavo Calderón Tenorio - AI-Augmented Developer</p>
      </footer>
    </>
  );
}
