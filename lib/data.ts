export interface Project {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  process: string;
  solution: string;
  technologies: string[];
  screenshots: { filename: string; description: string }[];
  liveSite: string;
  github: string;
  directorsNote: string;
}

export const projectsData: Project[] = [
  {
    id: "the-news-reader",
    title: "The News Reader",
    subtitle: "The News Reader — Full-Stack News Discovery Web App",
    problem:
      "External news APIs provide useful data, but calling them directly from the browser creates two problems: API credentials leak into frontend code, and raw results reach the UI without filtering or curation.\n\nThe objective was to turn that data into a usable news reader — while keeping credentials off the client and applying quality rules before anything renders.",
    process:
      "I structured the project as three layers: a React frontend, an Express proxy for local development, and a Vercel Serverless Function for production. The UI talks only to a stable internal `/api/news/all` endpoint, never to TheNewsApi directly.\n\nThe important decisions were architectural, not cosmetic. Credentials move in an `Authorization: Bearer` header and never as a query parameter. The proxy fetches 10 articles, keeps only those with a valid image and description, normalizes category names across Spanish, English, and Italian, and returns a curated set of 3. Category browsing sorts by date; search sorts by relevance. The same layer handles timeouts, rate limits, and upstream errors.\n\nOn the client, I added in-memory caching, request de-duplication, conditional adjacent-page prefetching, AbortController cancellation, lazy image loading, and asynchronous decoding. Theme, language, and favorites stay in `localStorage` — enough persistence for a single-user app without inventing a backend for preferences.",
    solution:
      "A responsive news reader with category browsing, keyword search, pagination, Spanish / English / Italian UI, persistent dark and light themes, local favorites, and article sharing. Desktop uses a two-column layout; mobile uses a drawer. Loading, empty, and error states are explicit, with a manual retry path.\n\nThe feed the user sees is curated. Broken cards do not reach the interface.",
    technologies: [
      "React 19",
      "TypeScript",
      "Vite",
      "Express",
      "Vercel Serverless Functions",
      "Vanilla CSS",
      "TheNewsApi",
    ],
    screenshots: [
      {
        filename: "main-desktop.png",
        description:
          "Main desktop view: article card, category sidebar, search, pagination, theme toggle, and language selector",
      },
      {
        filename: "feature-desktop.png",
        description: "Category filtering and search as mutually exclusive modes",
      },
      {
        filename: "mobile.png",
        description: "Mobile layout with drawer sidebar and full-width article card",
      },
      {
        filename: "feature-secondary.png",
        description: "Favorites sidebar with locally saved articles",
      },
    ],
    liveSite: "https://the-news-reader.vercel.app/",
    github: "https://github.com/Gustav-DEVhub/The-news-reader",
    directorsNote:
      "The frontend talks to an internal API instead of the news service, so credentials stay server-side and one layer can filter, normalize, and fail cleanly — fetching 10 articles and returning 3 curated results so the UI never renders broken cards.",
  },

  {
    id: "tonaliz-lite",
    title: "Tonaliz Lite",
    subtitle: "Independent Music Discovery & Local-First Listening App",
    problem:
      "Music apps often treat liking a track, saving a track, saving an artist, and saving a collection as if they were the same action. From the user's side, those actions stop meaning anything reliable.\n\nThe objective was to make each of those actions produce a different, predictable result — without user accounts or cloud sync.",
    process:
      "I structured the app around five distinct actions: Like a track (adds to Music I Like), Save a track (adds to the Saved collection), Follow an artist (artist appears in Library), Save a collection (curated playlists stay), and Save an album (album metadata persists). Each action is separate and produces different data.\n\nThe app is local-first. Everything lives in IndexedDB, wrapped with Dexie.js. The Jamendo API provides browsing and streaming. Audio playback uses the HTML5 Audio API with a custom player. State management is Zustand.\n\nDesktop has Home / Search / Library navigation. Mobile uses a persistent bottom bar. Both layouts share the same data layer but expose different actions — desktop has hover states, mobile has tap interactions.",
    solution:
      "A music discovery app that shows independent artists via Jamendo, lets users like tracks, save tracks to collections, follow artists, and browse a curated library — all without an account. The library persists locally. Audio plays inline. The UI is responsive and works on mobile.",
    technologies: [
      "React 19",
      "TypeScript",
      "Zustand",
      "Dexie.js",
      "IndexedDB",
      "Tailwind CSS",
      "Vite",
      "React Router",
      "Jamendo",
      "Vercel",
    ],
    screenshots: [
      {
        filename: "main-desktop.png",
        description: "Desktop Discover view with independent music shelves",
      },
      {
        filename: "feature-desktop.png",
        description:
          "Desktop Library: Music I Like, playlists, saved artists, saved collections",
      },
      {
        filename: "feature-secondary.png",
        description: "Artist page with artist tracks and artist actions",
      },
      {
        filename: "mobile.png",
        description: "Mobile Home with the Home / Search / Library navigation model",
      },
    ],
    liveSite: "https://tonaliz-lite.vercel.app/",
    github: "https://github.com/Gustav-DEVhub/tonaliz-lite",
    directorsNote:
      "Different content types should have different save semantics — that principle shaped the Library, the persistence model, and the desktop/mobile actions so saving a track, an artist, or a collection never produces the same data effect.",
  },

  {
    id: "recipe-app",
    title: "Recipes PWA",
    subtitle: "Offline-First Recipe Browser & Manager",
    problem:
      "Home cooks need a lightweight recipe browser that works offline for saved content, does not require an account, and lets them export their data. Public recipe APIs expose keys if called from the client, and most recipe apps lock data behind cloud sync or subscriptions.\n\nThe objective was a usable, installable app that hides the API key, stores the user's collection on the device, and supports real data portability.",
    process:
      "I designed a TypeScript monorepo: React 19 + Vite on the frontend, Express 5 as a development proxy, and Vercel serverless functions in production. The proxy hides TheMealDB key and caches categories server-side.\n\nOffline behavior is progressive, not absolute. A manual service worker — no Workbox — precaches the app shell, uses stale-while-revalidate for categories and images, network-first for searches and meals, and falls back to an offline page. IndexedDB, wrapped with `idb`, is the source of truth for favorites, meal details, shopping lists, and import jobs, with a versioned schema and upgrade handling.\n\nImport and export support Markdown, JSON, and Paprika JSON, with preview and conflict handling. The shopping list merges ingredients and exports to CSV or JSON. Vercel serves the static client and the API as one project.\n\nI deferred multi-device sync on purpose. v1 had to ship as a single deployable product.",
    solution:
      "Users can search and browse recipes online, open details with ingredients, instructions, tags, and a YouTube link, save full favorites, and build a shopping list. Viewed recipes remain available offline. Collections can be imported and exported. The app installs, supports light and dark themes, and does not ask for an account.",
    technologies: [
      "React 19",
      "TypeScript",
      "Vite",
      "Express 5",
      "TanStack Query",
      "IndexedDB",
      "Manual Service Worker",
      "shadcn/ui",
      "Tailwind CSS",
      "Vercel",
    ],
    screenshots: [
      {
        filename: "main-desktop.png",
        description: "Main desktop browsing: categories, search, and recipe results",
      },
      {
        filename: "feature-desktop.png",
        description: "Recipe detail: ingredients, instructions, and metadata",
      },
      {
        filename: "mobile.png",
        description: "Mobile browsing layout",
      },
      {
        filename: "feature-secondary.png",
        description: "Locally saved recipes or shopping list",
      },
    ],
    liveSite: "https://recipe-app-six-inky.vercel.app/",
    github: "https://github.com/Gustav-DEVhub/recipe-app",
    directorsNote:
      "Offline-first is a spectrum, not a binary. The service worker decides when to trust the network and when to trust the cache — and that decision is explicit per resource type, not global.",
  },

  {
    id: "scoundrel-game-pwa",
    title: "Scoundrel Game PWA",
    subtitle: "Single-Player Card Game PWA",
    problem:
      "Solo card games need a rules engine that enforces the full ruleset, a UI that makes the game state legible, and a way to save progress between sessions. Browser-based games often fail on at least one of these.\n\nThe objective was a playable, installable card game that remembers where you left off.",
    process:
      "I isolated a vanilla JavaScript game engine inside a thin React shell. The engine handles the full Scoundrel ruleset — 44-card deck, four-card rooms, weapon decay, potion limit, avoid mechanic, and win/lose scoring. The shell provides rendering and user interaction only.\n\nA custom service worker handles offline caching: the app shell precaches, API calls network-first, and game state persists in localStorage.\n\nThe UI tracks session history in a collapsible log. Achievements are stored in localStorage with unlock state. The top-10 leaderboard is in-memory only, reset on reload.\n\nI added particle effects on win/lose, a settings modal for volume and motion preferences, and an onboarding modal that explains the rules.",
    solution:
      "A fully playable PWA that plays the full Scoundrel ruleset: 44-card deck, four-card rooms, weapon decay, potion limit, avoid mechanic, and win/lose scoring. Sessions resume on reload. Fourteen achievements, a local top-10 leaderboard, particle effects, settings, and an onboarding modal are included. The UI is responsive down to 360px, with skip links, ARIA labels, focus trapping, and `prefers-reduced-motion`. After the first load, the game does not need the network.",
    technologies: [
      "Vanilla JavaScript",
      "React 18 (shell)",
      "Vite",
      "TypeScript",
      "Web Audio API",
      "Custom Service Worker",
      "CSS Custom Properties",
      "Vercel",
    ],
    screenshots: [
      {
        filename: "main-desktop.png",
        description:
          "Main desktop gameplay: HUD, health, weapon and deck stats, four-card room, and session log",
      },
      {
        filename: "feature-desktop.png",
        description: "Key gameplay interaction (card selection or combat resolution)",
      },
      {
        filename: "mobile.png",
        description: "Mobile gameplay: card layout, stats, and action controls",
      },
      {
        filename: "feature-secondary.png",
        description: "Achievements gallery and progression feedback",
      },
    ],
    liveSite: "https://scoundrel-game-pwa-lilac.vercel.app/",
    github: "https://github.com/Gustav-DEVhub/scoundrel-game-pwa",
    directorsNote:
      "I isolated a vanilla JavaScript game core inside a thin React shell so the logic stays portable and framework-independent, and I wrote a custom service worker for explicit control over offline caching.",
  },
];

export const aboutContent = {
  role: "AI-Augmented Developer",
  intro: "I'm a self-taught developer working as an AI-Augmented Developer — practical, deployed work instead of formal employment.",
  evidence:
    "The work on this page is the evidence: live products, public GitHub repositories, and the engineering decisions behind them.",
  availability: "Available for junior roles and freelance web development.",
  location: "Based in Peru (UTC-5) — Available for Remote Work & Relocation",
  sections: [
    {
      subtitle: "How I got here",
      paragraphs: [
        "I entered software development through Zero to Mastery (ZTM). I do not have formal employment in technology. What I do have is practical work: public repositories, production deployments on Vercel, and the reason each decision exists.",
        "I use AI-assisted development, routed through multiple model providers, to move faster on implementation and iteration. The products still have to be designed, built, deployed, and explained.",
      ],
      bullets: [] as string[],
    },
    {
      subtitle: "What I'm looking for now",
      paragraphs: [] as string[],
      bullets: [
        "Full-stack and frontend web applications",
        "Landing pages and small-to-medium tools that need to ship",
        "Remote junior roles and freelance projects",
        "Startups, small teams, and clients who need something functional — not theoretical",
      ],
    },
    {
      subtitle: "What's next",
      paragraphs: [
        "Over the medium term I am studying toward AI Engineering as part of my ZTM path. That is a direction. It is not my current role.",
      ],
      bullets: [] as string[],
    },
  ],
  closing: [
    "I am ready to work. The evidence is above.",
    "Type /contact to get in touch or /work to see my projects.",
  ],
};

export const skillsContent = {
  capabilities: [
    "Full-stack app development — frontend + backend, end-to-end",
    "Deployment to production (Vercel) · version control (GitHub)",
    "API and third-party service integration",
    "AI-assisted development with a self-built workflow, not tied to a single provider",
  ],
  tools: {
    "Frontend":
      "React · TypeScript · Next.js · JavaScript · HTML / CSS · Tailwind",
    "Backend & Data":
      "Node.js · Express\nPython (fundamentals — loops, functions, logical operators, scope, and ongoing learning)",
    "AI Workflow":
      "Cline (VS Code agent interface) · OpenRouter (multi-provider model routing)",
  },
};

export const contactContent = {
  email: "gustavo.calderon.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/gustavo-calderon-tenorio-530049369",
  github: "https://github.com/Gustav-DEVhub",
};

export const heroContent = `I build real products, deploy them, and can explain the engineering and product decisions behind them.`;

export const helpHeader = "Available commands:";

export const helpText = `  /about      - Learn about Gustavo
  /skills     - Show skills and tools
  /work       - View projects
  /contact    - Get in touch
  /github     - Open GitHub profile in a new tab
  /linkedin   - Open LinkedIn profile in a new tab
  /themes     - Change terminal theme
  /clear      - Clear the terminal screen
  /help       - Show this help message`;

export const welcomeMessage = `Welcome to Gustavo's interactive terminal.

Type /help to see available commands, or use the buttons below.
This portfolio is fully usable without typing — just click.`;