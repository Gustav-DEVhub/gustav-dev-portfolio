import CliShell from "@/app/components/CliShell";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start bg-black p-4 sm:p-6 md:p-8">
      <CliShell />
    </main>
  );
}
