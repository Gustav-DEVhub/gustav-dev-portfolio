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
        filename: "01-main-desktop.png",
        description:
          "Main desktop view: article card, category sidebar, search, pagination, theme toggle, and language selector",
      },
      {
        filename: "02-feature-desktop.png",
        description: "Category filtering and search as mutually exclusive modes",
      },
      {
        filename: "03-mobile.png",
        description: "Mobile layout with drawer sidebar and full-width article card",
      },
      {
        filename: "04-feature-secondary.png",
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
      "I built the app iteratively around product semantics, not around isolated screens. `Music I Like` is favorites. `Songs` is persisted saved tracks. Saved artists, saved collections, and local playlists are separate. That decision drove the data model, the persistence layer, the Library, contextual menus, and the player.\n\nState lives in Zustand. Persistent user data lives in IndexedDB through Dexie.js. Music data comes from Jamendo. There is no custom backend, no authentication, and no cloud synchronization.\n\nDesktop and mobile needed different interaction surfaces: contextual popovers on desktop, bottom sheets on mobile. Final QA on the deployed app focused on duplicated actions, Share and Copy Link behavior, Library filtering, artist save behavior, player and queue consistency, and responsive layout.",
    solution:
      "A responsive listening app with mood-based Home recommendations, Discover shelves, Search, and a structured Library. Users can save tracks, save artists, save collections, build local playlists, manage a queue, and keep playback going through a mini-player and an expanded player. Shuffle, repeat, add-to-queue, and add-to-playlist are independent actions. PWA installation is configured.\n\nSaving an artist does not silently save a song. Saving a song does not silently save a collection.",
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
        filename: "tonaliz-discover-desktop.png",
        description: "Desktop Discover view with independent music shelves",
      },
      {
        filename: "tonaliz-home-mobile.png",
        description: "Mobile Home with the Home / Search / Library navigation model",
      },
      {
        filename: "tonaliz-library-desktop.png",
        description:
          "Desktop Library: Music I Like, playlists, saved artists, saved collections",
      },
      {
        filename: "tonaliz-artist-desktop.png",
        description: "Artist page for Fluxo, with artist tracks and artist actions",
      },
      {
        filename: "tonaliz-player-mobile.png",
        description: "Mobile player with active playback",
      },
    ],
    liveSite: "https://tonaliz-lite.vercel.app/",
    github: "https://github.com/Gustav-DEVhub/tonaliz-lite",
    directorsNote:
      "Different content types should have different save semantics — that principle shaped the Library, the persistence model, and the desktop/mobile actions so saving a track, an artist, or a collection never produces the same data effect.",
  },
  {
    id: "recipes-pwa",
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
        filename: "01-main-desktop.png",
        description: "Main desktop browsing: categories, search, and recipe results",
      },
      {
        filename: "02-feature-desktop.png",
        description: "Recipe detail: ingredients, instructions, and metadata",
      },
      {
        filename: "03-mobile.png",
        description: "Mobile browsing layout",
      },
      {
        filename: "04-feature-secondary.png",
        description: "Locally saved recipes or shopping list",
      },
    ],
    liveSite: "https://recipe-app-six-inky.vercel.app/",
    github: "https://github.com/Gustav-DEVhub/recipe-app",
    directorsNote:
      "I chose a local-first, no-auth architecture with IndexedDB and a manual service worker so saved recipes work offline without accounts or a server database — and I deferred multi-device sync to keep v1 deployable as a single Vercel project.",
  },
  {
    id: "scoundrel-game-pwa",
    title: "Scoundrel Game PWA",
    subtitle: "Offline-Capable Solo Card Game PWA",
    problem:
      "Digital card games usually require accounts, servers, and a constant connection. Scoundrel is single-player, with perfect information per room. That design fits an offline-capable PWA that keeps data on the device and does not depend on infrastructure.\n\nThe objective was a finished, installable game — not a demo of the rules.",
    process:
      "The game core is vanilla JavaScript (46 KB, no framework, no dependencies), sitting in `public/scoundrel/` as a self-contained static site. A thin React/Vite/TypeScript shell — about 30 lines of TSX — only embeds that core in an iframe and registers the service worker. The split keeps game logic portable and prevents style or script collisions.\n\nI wrote a custom service worker for a 23-asset precache list, with network-first navigation and cache-first assets. All progress lives in versioned `localStorage` keys: game state, achievements, leaderboard, and preferences.\n\nAudio is procedural. Thirteen sound effects and a two-mood looping BGM are synthesized with the Web Audio API at runtime, so there are no audio files to download and sound still works offline. Layout scales through CSS custom properties rather than JavaScript resize handlers. Keyboard and touch are first-class: full keyboard shortcuts, swipe gestures, and a sticky mobile action bar.",
    solution:
      "An installable PWA that plays the full Scoundrel ruleset: 44-card deck, four-card rooms, weapon decay, potion limit, avoid mechanic, and win/lose scoring. Sessions resume on reload. Fourteen achievements, a local top-10 leaderboard, particle effects, settings, and an onboarding modal are included. The UI is responsive down to 360px, with skip links, ARIA labels, focus trapping, and `prefers-reduced-motion`. After the first load, the game does not need the network.",
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
        filename: "01-main-desktop.png",
        description:
          "Main desktop gameplay: HUD, health, weapon and deck stats, four-card room, and session log",
      },
      {
        filename: "02-feature-desktop.png",
        description: "Key gameplay interaction (card selection or combat resolution)",
      },
      {
        filename: "03-mobile.png",
        description: "Mobile gameplay: card layout, stats, and action controls",
      },
      {
        filename: "04-feature-secondary.png",
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
  name: "Gustavo Calderón Tenorio",
  role: "AI-Augmented Developer",
  intro: "I build functional web applications and deploy them to production.",
  evidence:
    "The work on this page is the evidence: live products, public GitHub repositories, and the engineering decisions behind them.",
  availability: "Available for junior roles and freelance web development.",
  body: `I'm Gustavo Calderón Tenorio, an AI-Augmented Developer. I build web applications with React, TypeScript, JavaScript, HTML, and CSS, and I deploy them.

I entered software development through Zero to Mastery (ZTM). I do not have formal employment in technology. What I do have is practical work: public repositories, production deployments on Vercel, and products I can walk through — architecture, trade-offs, and the reason each decision exists.

I use AI-assisted development (Claude, Copilot, Cursor) to move faster on implementation and iteration. The products still have to be designed, built, deployed, and explained.

Right now I want to work on real web products: full-stack and frontend applications, landing pages, and small-to-medium tools that need to ship. I am looking for remote junior roles and freelance projects with startups, small teams, and clients who need something functional — not theoretical.

Over the medium term I am studying toward Data Engineering as part of my ZTM path. That is a direction. It is not my current role.

I am ready to work. The evidence is above.`,
};

export const contactContent = {
  email: "gustavo.calderon.dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/gustavo-calderon-tenorio-530049369",
  github: "https://github.com/Gustav-DEVhub",
};

export const heroContent = `I build real products, deploy them, and can explain the engineering and product decisions behind them.`;

export const helpText = `Available commands:
  /about      - Learn about Gustavo
  /work       - View projects
  /contact    - Get in touch
  /github     - Open GitHub profile in a new tab
  /linkedin   - Open LinkedIn profile in a new tab
  /clear      - Clear the terminal screen
  /help       - Show this help message`;

export const welcomeMessage = `Welcome to Gustavo's interactive terminal.

Type /help to see available commands, or use the buttons below.
This portfolio is fully usable without typing — just click.`;
