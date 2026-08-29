export const CLI_COMMANDS = [
  { cmd: "/help", hint: "Show available commands" },
  { cmd: "/about", hint: "About Gustavo" },
  { cmd: "/work", hint: "View deployed projects" },
  { cmd: "/contact", hint: "Email, LinkedIn, GitHub" },
  { cmd: "/github", hint: "Open GitHub profile" },
  { cmd: "/linkedin", hint: "Open LinkedIn profile" },
  { cmd: "/clear", hint: "Clear terminal history" },
] as const;

export type CliCommand = (typeof CLI_COMMANDS)[number];

export const SLASHLESS_COMMANDS = [
  "help",
  "about",
  "work",
  "contact",
  "github",
  "linkedin",
  "clear",
] as const;

/**
 * Filters commands based on input. Supports both slash and slash-less commands.
 * - Empty input or "/" shows all commands
 * - "/a" filters to commands starting with "/a"
 * - "a" (slash-less) filters to commands starting with "/a"
 */
export function filterCommands(input: string): CliCommand[] {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === "" || trimmed === "/") {
    return [...CLI_COMMANDS];
  }
  // Normalize slash-less input for filtering
  const query = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return CLI_COMMANDS.filter((command) => command.cmd.startsWith(query));
}

/**
 * Normalizes a raw command to always have a leading slash and lowercase command head.
 * Examples:
 *   "about" → "/about"
 *   "/About" → "/about"
 *   "/WORK 1" → "/work 1"
 */
export function normalizeCommand(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const [head, ...rest] = withSlash.split(/\s+/);
  return [head.toLowerCase(), ...rest].join(" ");
}

/**
 * Gets the full command (with slash) for a slash-less alias.
 * Returns the normalized command if it matches a known command, otherwise returns the input.
 */
export function resolveSlashlessCommand(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (SLASHLESS_COMMANDS.includes(trimmed as typeof SLASHLESS_COMMANDS[number])) {
    return `/${trimmed}`;
  }
  return input;
}