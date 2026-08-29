# Gustav Projects

## Objetivo de este archivo
Este archivo reúne los proyectos principales de Gustavo Calderón Tenorio para usarlos como base en:
- CV
- LinkedIn
- Portfolio
- Postulaciones freelance o junior

## Reglas de posicionamiento
- Estos proyectos representan experiencia práctica real basada en construcción, despliegue y documentación.
- No deben presentarse como experiencia laboral formal.
- No se deben inventar clientes, métricas, usuarios o resultados comerciales.
- Sí deben presentarse como evidencia concreta de capacidad para diseñar, desarrollar y desplegar productos web.


---


# Project 1: The News Reader
## Recommended Professional Name
The News Reader — Full-Stack News Discovery Web App
## Project Type
Full-Stack Web Application / News Discovery Platform
## Status
Completed and publicly deployed.
The project has been functionally validated through the final Vercel deployment. The repository and production deployment are connected through GitHub and Vercel.
## Repository
https://github.com/Gustav-DEVhub/The-news-reader
## Deploy
https://the-news-reader.vercel.app/
## Professional Summary
The News Reader is a full-stack news discovery web application built with React 19, TypeScript, Vite, Express, and Vercel Serverless Functions.
The application provides category-based browsing, article search, pagination, multilingual UI support, theme persistence, local favorites, article sharing, and responsive desktop/mobile experiences.
The project uses an internal API proxy architecture to keep the external news API credential out of frontend code while centralizing request handling, filtering, and error processing.
## Problem
External news APIs provide raw data, but consuming that data directly from a browser can create both security and usability problems.
The News Reader was designed to provide a cleaner browsing experience while keeping API credentials outside the frontend and applying server-side filtering before news data reaches the client.
## Development Process
The project was structured around a separation between the frontend application, local development proxy, and production serverless API layer.
The frontend consumes a stable internal `/api/news/all` endpoint rather than calling TheNewsApi directly.
Development focused on:
- category-based news discovery;
- search and pagination;
- multilingual interface behavior;
- theme persistence;
- local favorites;
- responsive desktop/mobile layouts;
- API error handling;
- server-side article quality filtering (image + description required);
- client-side caching and request de-duplication;
- conditional adjacent-page prefetching;
- image loading optimization (lazy loading + async decoding);
- production deployment through Vercel.
The project was also refined through build validation and deployment verification.
## Final Solution
The completed application provides a responsive single-page news reader with:
- category browsing (mutually exclusive with search);
- article search with relevance sorting;
- pagination (3 articles per page);
- article navigation by index within page + pagination;
- multilingual interface in Spanish, English, and Italian;
- dark/light theme persistence;
- locally persisted favorites;
- article sharing through the Web Share API with clipboard fallback;
- responsive desktop (≥920px) and mobile layouts;
- loading, soft-loading, empty, and error states;
- manual retry behavior;
- server-side article quality filtering and category normalization;
- client-side caching and request de-duplication;
- Vercel production deployment.
## Stack
### Frontend
- React 19
- TypeScript
- Vite
### UI
- Custom React components
- Vanilla CSS
- CSS Custom Properties (variables) for theming
- Responsive media queries (breakpoint: 920px)
### State Management
- React state (useState/useRef) for category, search, language, pagination, favorites
- React Context for theme state only
### Backend
- Node.js
- Express
- Local development proxy (port 5177)
### Production API Layer
- Vercel Serverless Functions (`api/news/all.js`)
### External API
- TheNewsApi
### Persistence
- Browser `localStorage` (theme, language, favorites)
### Deployment
- Vercel (automatic deployment on push to main via Vercel dashboard configuration)
### Internationalization
- Custom language dictionary
- Spanish
- English
- Italian
## Architecture & Technical Context
The application uses a three-part request architecture:
1. The React frontend runs from `web/`.
2. During local development, `/api/*` requests are proxied through the Express server.
3. In production, `/api/news/all` is handled by a Vercel Serverless Function.
The frontend therefore communicates with an internal application endpoint rather than directly exposing TheNewsApi credentials.
The server-side layer is responsible for:
- external API communication;
- credential handling via `Authorization: Bearer <token>` header (never as query param);
- category and query normalization (diacritic-insensitive matching across ES/EN/IT variants);
- article quality filtering: requests 10 articles from upstream, filters for valid image + description/snippet, filters by requested category (canonicalized), returns top 3;
- upstream error handling (429 rate limit, 401/403 auth, 500/504 timeout);
- request timeout handling (10s via AbortController).
The client maintains application state for:
- category;
- search;
- language;
- pagination;
- current article index within page;
- favorites;
- loading, soft-loading, and error states.
User preferences and favorites are persisted locally through `localStorage` (keys: `news-reader-theme`, `news-reader:language`, `news-reader:favorites`).
Production API authentication uses the same `Authorization: Bearer <token>` header pattern in the Vercel Serverless Function as in the local Express proxy.
## Key Features
### News Discovery
- Category-based browsing (10 categories: tech, general, science, sports, business, health, entertainment, politics, food, travel).
- Search mode (keyword search with `relevance_score` sorting; mutually exclusive with category filtering).
- Pagination (3 articles per page, absolute article numbering in paginator).
- Article navigation by index within current page + pagination controls.
- Server-side quality filtering: proxy fetches 10, enforces image + description, normalizes categories, returns top 3.
### User Experience
- Spanish, English, and Italian interface with full dictionary localization.
- Dark and light themes with smooth transitions.
- Persistent theme and language preferences via `localStorage`.
- Responsive desktop (≥920px, two-column sidebar + content) and mobile (drawer sidebar) layouts.
- Favorites sidebar with thumbnails, persisted locally.
- Share functionality via Web Share API (native mobile) with clipboard fallback (desktop).
- Article opens in new tab (`target="_blank" rel="noreferrer"`).
### Performance
- Client-side in-memory caching (Map keyed by language + category/search + page).
- Request de-duplication per cache key (in-flight Map).
- Conditional adjacent-page prefetch (previous/next page when user reaches first/last article index).
- AbortController cancellation of previous request on navigation change.
- Lazy-loaded article images (`loading="lazy"`).
- Asynchronous image decoding (`decoding="async"`).
### Reliability
- Hard loading states (full-screen spinner on category/search/language change).
- Soft-loading states (subtle overlay when navigating within same page).
- Empty states (no results).
- Error states with manual retry button.
- Proxy timeout handling (10s, returns 504).
- Rate limit handling (429 surfaced to UI).
## Key Technical / Product Decisions
### Internal API Proxy Architecture
The application avoids direct frontend access to TheNewsApi by routing requests through an internal proxy/serverless layer.
This keeps the external API credential out of frontend code while also providing a centralized place for filtering, normalization, timeout handling, and error processing.
The proxy implements **defense in depth**: it requests 10 articles from upstream, applies strict quality filters (non-empty image_url + description/snippet), normalizes category names across language variants (stripping diacritics), filters by requested category, and returns only the top 3 results. This ensures a consistent, high-quality feed regardless of upstream noise.
### Local-First User Preferences
Theme, language, and favorites are persisted through browser `localStorage`.
This keeps the application lightweight and avoids unnecessary backend infrastructure for user-specific preferences within the project's current scope.
Cross-device synchronization would require a user authentication layer and database, which are outside current scope.
### Adaptive Sorting Strategy
Category browsing sorts by `published_at` (newest first). Search sorts by `relevance_score`. The proxy enforces this automatically based on request type.
## Director's Note
> The frontend talks to a stable internal API endpoint instead of directly exposing the external news service. This keeps credential handling server-side and gives the application one place to control filtering and error behavior. The proxy requests a buffer of 10 articles, filters for quality and relevance, and returns a curated set of 3 — ensuring the UI never renders broken cards.
## Portfolio Assets
### 01-main-desktop.png
Main desktop view (≥920px) showing the primary news browsing experience: article card with magazine-style overlay (42% left panel), category navigation sidebar, search, pagination with absolute numbering, theme toggle, and language selector.
### 02-feature-desktop.png
Desktop view highlighting category filtering (sidebar grid) and search functionality (mutually exclusive modes).
### 03-mobile.png
Responsive mobile view (<920px) showing drawer-style sidebar, full-width article card with gradient shade, adapted pagination, and compact language menu.
### 04-feature-secondary.png
Desktop view showing the Favorites sidebar with locally saved articles, thumbnails, and remove actions.
### 05-optional.png
Light theme desktop view demonstrating full theme adaptation across all components.
### GIF / Video
Not available.
### Live Site
https://the-news-reader.vercel.app/
### GitHub
https://github.com/Gustav-DEVhub/The-news-reader
## What This Demonstrates to Recruiters
The News Reader demonstrates practical experience with:
- React 19 and TypeScript application development;
- frontend component architecture;
- external API integration;
- backend proxy and serverless architecture;
- credential handling (Authorization header, never in URL);
- client-side state management (useState, useRef, Context for theme);
- local persistence (localStorage);
- responsive design with custom breakpoint (920px);
- internationalization (custom dictionary, 3 languages);
- loading, soft-loading, and error-state design;
- client-side caching and request de-duplication;
- conditional adjacent-page prefetching;
- request cancellation via AbortController;
- lazy image loading and asynchronous decoding;
- Vercel deployment with automatic GitHub integration;
- manual build validation (`npm run build`) before deploy.
The project also demonstrates the ability to connect frontend UX decisions with backend request handling and deployment architecture rather than treating the interface as an isolated layer.
## What This Demonstrates to Freelance Clients
The project demonstrates the ability to take an API-driven product idea from implementation through deployment.
It shows practical capability in:
- building responsive web applications;
- integrating external APIs securely;
- creating backend proxy layers (Express + Vercel Serverless);
- handling environment-based credentials;
- implementing search and filtering (mutually exclusive modes);
- adding browser persistence without backend;
- supporting responsive desktop/mobile experiences;
- implementing practical error, soft-loading, and retry states;
- deploying and maintaining a production web application on Vercel.
## Professional Signals
- Public GitHub repository.
- Public Vercel deployment.
- Vercel automatic deployment configured via dashboard (push to main → build → deploy).
- React 19 + TypeScript frontend.
- Express development proxy.
- Vercel production Serverless Function.
- External API integration with server-side credential handling.
- API credentials kept out of frontend code (Bearer header only).
- Multilingual interface (ES/EN/IT).
- Responsive UI (custom 920px breakpoint, drawer sidebar on mobile).
- Local persistence (theme, language, favorites).
- Client-side caching (Map) and request de-duplication (in-flight Map).
- Conditional adjacent-page prefetching.
- Request cancellation (AbortController).
- Lazy image loading + async decoding.
- Error, soft-loading, and manual retry handling.
- Manual production build validation.
## Scope & Limitations
The current project is a single-user news discovery application with client-side preferences and live external news data.
It does not currently include:
- User authentication.
- User accounts.
- Database-backed persistence.
- Cross-device synchronization (requires auth + DB).
- RSS feed management.
- Automated test coverage.
- Analytics or monitoring.
- Admin tooling.
- Moderation workflows.
- Multi-page routing (SPA architecture).
These capabilities are outside the current project scope and should not be presented as missing requirements for the completed application.
## Future Improvements
Potential future improvements include:
- Automated test coverage (unit, integration, e2e).
- Improved accessibility auditing (WCAG 2.1 AA).
- Additional performance profiling (Core Web Vitals).
- Expanded user persistence capabilities (requires backend).
- Cross-device synchronization (requires auth + DB).
- Analytics and monitoring.
- Further refinement of content discovery and personalization.
These should be presented as potential future work rather than existing functionality.
## CV Bullet Points
- Built and deployed a full-stack news discovery web application using React 19, TypeScript, Vite, Express, and Vercel Serverless Functions, integrating TheNewsApi through an internal API layer with Bearer-token credential handling.
- Implemented multilingual browsing, search (relevance sort), category browsing (date sort), pagination, favorites, theme persistence, responsive desktop/mobile layouts (920px breakpoint), and browser-based user preference storage.
- Improved client performance and request efficiency through in-memory caching, request de-duplication, conditional adjacent-page prefetching, request cancellation, lazy image loading, and asynchronous image decoding.
- Designed server-side quality pipeline: proxy fetches 10 articles, filters for image + description, normalizes categories across languages, returns curated top 3.
## LinkedIn Version
Built and deployed The News Reader, a full-stack news discovery application using React 19, TypeScript, Express, Vite, and Vercel Serverless Functions.
The project integrates TheNewsApi through an internal API layer to keep credentials out of frontend code while centralizing request handling, article quality filtering (10→3 curation), category normalization, and adaptive sorting (date for categories, relevance for search).
It also includes multilingual support (ES/EN/IT), search, pagination, local favorites, persistent themes, responsive desktop/mobile layouts (920px breakpoint), client-side caching, request de-duplication, conditional prefetching, request cancellation, and optimized image loading.
## Portfolio Version
### The News Reader
**A full-stack news discovery application focused on clean browsing, secure API integration, and responsive user experience.**
The News Reader transforms external news API data into a structured browsing experience with category discovery, search, pagination, multilingual support, favorites, theme persistence, sharing, and responsive layouts.
A key architectural decision was to keep the external API credential behind an internal proxy/serverless layer rather than exposing it directly to the browser. The proxy implements a quality pipeline: it requests a buffer of 10 articles, enforces image and description requirements, normalizes categories across language variants, and returns a curated set of 3 — ensuring the UI never renders broken cards.
The project also explores practical frontend performance techniques: in-memory caching, request de-duplication, conditional adjacent-page prefetching, AbortController-based cancellation, lazy image loading, and asynchronous image decoding.
**Key areas:**
- News discovery and search (mutually exclusive modes).
- Category filtering with server-side normalization.
- Multilingual interface (ES/EN/IT).
- Favorites and local persistence.
- Secure internal API architecture (Bearer header, quality pipeline).
- Responsive desktop/mobile UX (920px breakpoint).
- Client-side performance optimization (cache, dedupe, prefetch, abort, lazy, async decode).
- Vercel deployment with automatic GitHub integration.
**Stack:** React 19 · TypeScript · Vite · Express · Vercel Serverless Functions · Vanilla CSS (Custom Properties + Media Queries) · TheNewsApi
**Live:** https://the-news-reader.vercel.app/
**Code:** https://github.com/Gustav-DEVhub/The-news-reader
## Mini Case Study
### Problem
External news APIs provide useful data but do not automatically provide a polished product experience. Direct browser access can also expose API credentials and place filtering and request handling entirely on the client.
### Process
The project was structured around a React frontend, an Express proxy for local development, and a Vercel Serverless Function for production API requests.
The implementation focused on creating a consistent internal API boundary while adding news discovery, search, pagination, multilingual support, local persistence, responsive interaction patterns, and request-level optimizations.
A server-side quality pipeline was built: the proxy requests 10 articles, filters for valid image + description, normalizes category names across Spanish/English/Italian variants (diacritic-insensitive), filters by requested category, and returns the top 3 results.
### Solution
The final application provides a responsive news discovery experience with category browsing, search, pagination, favorites, theme persistence, article sharing, multilingual UI, and server-side API handling.
The internal proxy/serverless layer keeps the external credential out of frontend code and centralizes API request processing, quality filtering, and error handling.
### Result
A publicly deployed and functionally validated full-stack web application demonstrating practical frontend development, secure API integration, serverless architecture, local persistence, responsive UX (920px breakpoint), performance-conscious request handling (cache, dedupe, prefetch, abort, lazy, async decode), and Vercel deployment with automatic GitHub integration.

---

# Corrected Professional Block (Deploy URL Updated)

---
# Project 2: Recipes PWA
## Recommended Professional Name
Recipes PWA — Offline-First Recipe Browser & Manager

## Project Type
Portfolio / Personal Project — Progressive Web App (PWA)

## Status
Phase 1 completed — Stable v1

## Repository
https://github.com/Gustav-DEVhub/recipe-app

## Deploy
https://recipe-app-six-inky.vercel.app/

## Professional Summary
A production-deployed Progressive Web App for discovering, saving, and managing recipes from TheMealDB. Built as a TypeScript monorepo with a React 19 + Vite frontend and an Express 5 backend proxy, deployed as a single Vercel project. Features progressive offline support via IndexedDB (favorites, shopping list, import/export) and a manual service worker implementing multiple caching strategies. No user authentication or persistent server database required — truly local-first architecture.

## Problem
Home cooks need a lightweight, installable recipe browser that works offline for saved content, doesn't require accounts, and supports data portability (import/export). Public recipe APIs expose keys if called client-side, and most recipe apps lock data behind cloud sync or subscriptions.

## Development Process
1. Designed monorepo structure with shared root scripts (`concurrently` for dev).
2. Built Express proxy (`/api/*`) to hide TheMealDB API key and cache categories server-side.
3. Implemented React frontend with TanStack Query, React Router, and `idb`-wrapped IndexedDB.
4. Created manual service worker with route-specific caching: precache app shell, stale-while-revalidate for categories/images, network-first for searches/meals, offline navigation fallback.
5. Built offline-first features: favorites (full meal details), shopping list (merge/export/print), import/export (Markdown, JSON, Paprika JSON) with preview and conflict handling.
6. Configured Vercel monorepo deployment via `vercel.json` rewrites and catch-all API handler.
7. Polished UI with shadcn/ui, custom CSS variable theming (light/dark), skeleton loaders, animations, and accessibility basics.

## Final Solution
An installable PWA that lets users search/browse recipes online, caches viewed recipes for offline detail access, saves favorites and shopping lists locally, and exports/imports collections in multiple formats — all deployable to Vercel without user authentication or a persistent server database.

## Stack
- **Frontend**: React 19, Vite 8, TypeScript (strict), TanStack Query v5, React Router DOM v7
- **UI/Styling**: shadcn/ui (Radix Dialog/Slot), Tailwind CSS v3, custom CSS variables (theming)
- **Backend (dev)**: Express 5, TypeScript, tsx watch, helmet/cors/compression
- **Backend (prod)**: Vercel serverless functions (`api/[...all].ts` → Express handler)
- **API**: TheMealDB v1 (proxied, key hidden in server env)
- **Persistence**: IndexedDB via `idb` v8 (favorites, meal details, recent, query cache, shopping list, import jobs)
- **PWA**: Manifest, icons (192/512), screenshots, manual Service Worker (`public/sw.js`)
- **Deployment**: Vercel (monorepo: `client/dist` static + `/api/*` serverless)
- **Dev Tools**: concurrently, sonner (toasts), lucide-react (icons), clsx/tailwind-merge/CVA

## Architecture & Technical Context
```
Browser (HTTPS) → Vercel Static (client/dist) + Vercel Functions (api/[...all].ts)
                                    ↓
                              Express app handler
                                    ↓
                              TheMealDB (www.themealdb.com)

Client-side:
  - TanStack Query (server state, 5min stale / 30min GC)
  - IndexedDB (persistent offline data: favorites, shopping, imports)
  - Service Worker (Cache API: precache + runtime per route type)
  - React Router (SPA navigation)
```

**Note**: The backend exists as an Express proxy (dev) and Vercel serverless functions (prod). The "no backend infrastructure" claim in earlier drafts was incorrect — the project has a backend layer but no user authentication or persistent server database.

## Key Features
- Recipe search & category browse (online, with offline cache fallback)
- Recipe details: ingredients/measures, instructions, tags, YouTube link
- Offline favorites (add/remove/view) with full meal persistence
- Shopping list: checklist, ingredient merging, CSV/JSON export, print
- Bulk import/export: Markdown, JSON, Paprika JSON with preview & conflict strategy
- PWA installable: manifest, icons, screenshots, offline fallback page
- Light/dark theme with system preference + manual toggle
- Responsive, animated UI with skeleton loaders and error boundaries

## Key Technical / Product Decisions
1. **Backend proxy** — hides API key, enables server caching, stable client contract
2. **Manual service worker** — full control over per-route caching strategies, no Workbox dependency
3. **IndexedDB as offline source of truth** — unified schema for all persistent client data with retry/upgrade logic
4. **Vercel monorepo** — single project serves frontend + API, no CORS complexity, zero config
5. **Local-first, no-auth** — eliminates auth/DB costs and friction; sync deferred to V2
6. **Progressive offline** — caches only visited content, not full catalog
7. **Paprika JSON support** — targets popular recipe app format for interoperability

## Director's Note
Choosing a local-first, no-auth architecture with IndexedDB + manual service worker made the PWA genuinely useful offline without user authentication or a persistent server database — but it deliberately defers multi-device sync to a future version, keeping v1 scope tight and deployable as a single Vercel project.

## Portfolio Assets
### 01-main-desktop.png
Main desktop view showing the primary recipe browsing experience, including category navigation, search, recipe results, and responsive UI structure.

### 02-feature-desktop.png
Desktop feature view highlighting a recipe detail experience with ingredients, instructions, and recipe metadata.

### 03-mobile.png
Responsive mobile view showing the recipe browsing experience and adaptive layout on a smaller screen.

### 04-feature-secondary.png
Desktop feature view showing locally saved recipes or shopping list functionality.

### GIF / Video
Not currently available — **Recommend**: Offline demo — load recipe → favorite → disconnect → reload → open favorite

### Live Site
https://recipe-app-six-inky.vercel.app/

### GitHub
https://github.com/Gustav-DEVhub/recipe-app

## What This Demonstrates to Recruiters
- Full-stack TypeScript: React 19 + Vite + Express 5 + Vercel serverless
- PWA engineering: manual SW with multiple caching strategies, offline fallback, installability
- Client-side persistence: IndexedDB schema design, migration-safe upgrades (v4), retry logic
- API integration: proxy pattern, server-side caching, environment-based config
- State management: TanStack Query + local React state + persistent DB coordination
- UI/UX: shadcn/ui + Tailwind + custom CSS variables (theming), accessibility (ARIA, focus-visible), reduced-motion support
- Monorepo tooling: concurrent dev, unified build, Vercel rewrites
- Data transformation: TheMealDB normalization, Markdown/JSON/Paprika parsers, CSV export

## What This Demonstrates to Freelance Clients
- Delivers working progressive offline web apps without user authentication or persistent server database costs
- Implements PWA properly (manifest, SW, icons, screenshots, offline page)
- Builds maintainable TypeScript codebases with clear separation of concerns
- Handles third-party API integration securely (proxy, key hiding, caching)
- Provides data portability (import/export) — reduces vendor lock-in risk
- Deploys to Vercel with zero-config monorepo setup

## Professional Signals
- TypeScript strict mode in both packages
- ESM modules throughout (`"type": "module"`)
- Modern React patterns (hooks, QueryClientProvider, ErrorBoundary)
- Accessibility considerations (ARIA labels, focus-visible, semantic HTML)
- Performance: skeleton loaders, lazy images, code-split routes (Vite), stale-while-revalidate
- Security: helmet, cors, compression, API key only in server env
- Clean Git history with conventional-ish commits (`fix:`, `feat:`, etc.)
- Comprehensive README with setup, deploy, offline test instructions
- Versioned IndexedDB schema with upgrade handling

## Scope & Limitations
**Scope (v1):**
- Single-user, single-device, local-only persistence
- TheMealDB as sole data source (read-only)
- Progressive offline: only visited/cached content and locally persisted data available offline
- No user accounts, no cloud sync, no social features

**Limitations:**
- TheMealDB rate limits / reliability not controlled
- Images not cached for true offline (only dataURL thumbnails for favorites)
- No automated tests — regression risk on changes
- Service worker only registers on HTTPS (not localhost dev)
- No CI/CD pipeline configured (manual Vercel deploy)
- Bundle size not analyzed (Radix + TanStack + idb + lucide = moderate)
- Accessibility audit not documented (manual only)

## Future Improvements
- Supabase integration for authentication + multi-device sync (documented V2)
- Share recipes/lists with signed links (documented V2)
- OAuth (Google) as optional social login (documented V2)
- Full catalog preloading option (opt-in)
- Automated test suite (Vitest client, supertest server)
- Image optimization / CDN

## CV Bullet Points
- Built a production PWA (React 19 + TypeScript + Vercel) with progressive offline support via IndexedDB and a manual Service Worker implementing route-specific caching strategies.
- Designed a secure Express proxy to hide third-party API keys, with server-side caching and Vercel serverless deployment.
- Implemented local-first data layer: favorites, shopping list (with ingredient merging), and import/export (Markdown/JSON/Paprika) — all in IndexedDB with versioned schema.
- Delivered a zero-auth, installable recipe manager deployable as a single Vercel monorepo project.

## LinkedIn Version
Built **Recipes PWA** — a Progressive Web App for browsing and saving recipes offline. React 19 + TypeScript frontend, Express 5 proxy backend, deployed as a single Vercel project. Features: offline favorites/shopping list via IndexedDB, multi-format import/export (Markdown, JSON, Paprika), manual Service Worker with stale-while-revalidate and network-first caching, and a responsive UI with shadcn/ui + Tailwind. No auth, no persistent server database — truly local-first. 🔗 github.com/Gustav-DEVhub/recipe-app

## Portfolio Version
**Recipes PWA** — Offline-First Recipe Browser & Manager  
*TypeScript • React 19 • Vite • Express 5 • Vercel • IndexedDB • PWA*

A fully installable Progressive Web App for discovering recipes from TheMealDB. Search by name, browse categories, view details with ingredients and YouTube links — then save favorites and build shopping lists that work completely offline. Import/export your collection in Markdown, JSON, or Paprika format. Built as a TypeScript monorepo with a manual Service Worker (no Workbox) implementing multiple caching strategies, deployed to Vercel as a single project serving both static frontend and serverless API. No user authentication or persistent server database.

## Mini Case Study
### Problem
Home cooks want a recipe app that works offline for saved content, doesn't require accounts, and lets them own their data — but most apps require cloud sync, hide API keys poorly, or lock export behind subscriptions.

### Process
Designed a local-first architecture: Express proxy hides TheMealDB key and caches categories; React frontend uses TanStack Query for server state and IndexedDB (via `idb`) for all persistent offline data. Built a manual Service Worker with precache + per-route runtime strategies (stale-while-revalidate for categories/images, network-first for searches/meals). Added import/export parsers for Markdown, JSON, and Paprika JSON with preview and conflict handling. Deployed as a Vercel monorepo (static + serverless in one project).

### Solution
A PWA that caches viewed recipes for offline detail access, stores favorites/shopping lists/imports locally, exports to multiple formats, and installs on any device — with a backend proxy but no user authentication or persistent server database.

### Result
Production-deployed PWA at Vercel (https://recipe-app-six-inky.vercel.app/); 100% client-side persistence; progressive offline that works for real usage patterns; clean TypeScript codebase demonstrating full-stack, PWA, and data-layer engineering.

---

**Documentation status: READY FOR MANUAL INSERTION INTO Gustav_Projects.md**

---

# Project 3: Scoundrel Game PWA
## Recommended Professional Name
Scoundrel — Offline-Capable Solo Card Game PWA
## Project Type
Client-Side Progressive Web App (Game)
## Status
Phase 1 completed — Stable deployed version
## Repository
https://github.com/Gustav-DEVhub/scoundrel-game-pwa
## Deploy
https://scoundrel-game-pwa-lilac.vercel.app
## Professional Summary
A complete client-side implementation of the Scoundrel card game rules as an installable Progressive Web App. The game runs entirely in the browser with no backend, featuring procedural audio, particle effects, 14 achievements, a local leaderboard, and game state persistence. Core gameplay remains available offline after the initial successful load.
## Problem
Digital card games typically require accounts, servers, and persistent connectivity. Scoundrel's single-player, perfect-information-per-room design makes it well-suited for an offline-capable PWA that respects user privacy and operates without infrastructure.
## Development Process
Bootstrapped via Vercel (2026-05-09), evolved through three focused commits: PWA foundation (service worker, manifest, icons), asset/installability fixes, documentation. The game core was built as vanilla JavaScript (46 KB) in `public/scoundrel/` — a deliberate choice to keep logic portable and framework-free — while a minimal React/Vite/TypeScript shell handles only service worker registration and iframe embedding.
## Final Solution
Production PWA at `scoundrel-game-pwa-lilac.vercel.app` that installs on desktop/mobile, caches 23 assets via custom service worker (precache + runtime), persists all progress in localStorage, and delivers a polished experience with procedural Web Audio SFX/BGM, CSS animations, particle bursts, keyboard/touch parity, and accessibility-focused implementation.
## Stack
- **Build**: Vite 5, TypeScript 5, React 18 (shell only)
- **Game Core**: Vanilla JavaScript ES2020 (no framework, no dependencies)
- **Styling**: Plain CSS with custom properties (68 KB design system, 26 sections)
- **PWA**: manifest.webmanifest, custom sw.js (v2 precache + runtime), icons (192/512), screenshots (mobile/desktop)
- **Audio**: Web Audio API — 13 procedural SFX + 2-mood looping BGM (dungeon/danger)
- **Persistence**: localStorage (game state, achievements, leaderboard, preferences)
- **Deployment**: Vercel static hosting (public production aliases)
- **Tooling**: ESLint 9, TypeScript strict mode, PowerShell asset generation script
## Architecture & Technical Context
Two-layer architecture:
1. **React Shell** (`src/`): ~30 lines TSX. Renders `<iframe src="/scoundrel/index.html">`, registers `/sw.js` in production.
2. **Game Core** (`public/scoundrel/`): Self-contained static site. `index.html` (markup/overlays), `style.css` (design system), `js/main.js` (game engine), `js/audio.js` (Web Audio), `js/particles.js` (DOM particles), `js/achievements.js` (14 achievements + toasts), `js/leaderboard.js` (top-10), `assets/` (10 card background images).

No backend, API, database, or external services. Service worker uses network-first for navigation, cache-first for assets. All state in localStorage with versioned keys.
## Key Features
- Complete Scoundrel rules: 44-card deck, 4-card rooms, select 3, weapon decay rule, potion limit, avoid mechanic, win/lose scoring
- Game state persistence with resume-on-reload
- 14 achievements with toast notifications + overlay gallery
- Local leaderboard (top 10, win/loss, turns, date)
- Procedural audio: zero external files, synthesized at runtime
- Particle effects on key interactions
- Full keyboard (N/A/1-4/H/L/Esc) + touch/swipe controls
- Settings: SFX/music toggles, volume sliders, motion reduction, data reset
- Accessibility-focused implementation: skip link, ARIA labels/roles, focus trapping, semantic HTML, prefers-reduced-motion, keyboard/touch support
- Responsive: 4-col → 2×2 → 2-col breakpoints, sticky mobile action bar, safe-area insets
- Onboarding modal for first-time players
- PWA installable (standalone, portrait, offline-capable after first load)
## Key Technical / Product Decisions
1. **Vanilla JS game core iframed by React shell** — Portable, auditable, zero framework lock-in for game logic.
2. **Custom service worker** — Precise control over 23-asset precache list, cache versions, navigation vs. asset strategies.
3. **Procedural Web Audio** — 13 SFX + 2-mood BGM with zero asset downloads; works offline.
4. **localStorage-only persistence** — Keeps the application server-independent and avoids account or database infrastructure. Trade-off: data remains device-bound.
5. **CSS custom properties for responsive cards** — `--card-w`/`--card-gap` scale at breakpoints; no JS resize handlers.
6. **Iframe isolation** — Prevents style/script collisions; game is a droppable static artifact.
7. **Documented Vercel PWA caveats** — Production aliases vs. protected URLs; saves debugging time.
## Director's Note
The iframe + vanilla JS architecture was designed to keep the game core portable and framework-independent. The custom service worker provides explicit control over the application's offline caching behavior.
## Portfolio Assets
### 01-main-desktop.png
PORTFOLIO_ASSETS/scoundrel-game-pwa/01-main-desktop.png
Main desktop gameplay view showing the game HUD, health bar, weapon and deck statistics, four-card room, room-resolution controls, and session log.
### 02-feature-desktop.png
PORTFOLIO_ASSETS/scoundrel-game-pwa/02-feature-desktop.png
Desktop feature view highlighting a key gameplay interaction such as card selection or combat resolution.
### 03-mobile.png
PORTFOLIO_ASSETS/scoundrel-game-pwa/03-mobile.png
Responsive mobile gameplay view showing the card layout, game statistics, action controls, and mobile interaction model.
### 04-feature-secondary.png
PORTFOLIO_ASSETS/scoundrel-game-pwa/04-feature-secondary.png
Feature view highlighting the achievements system, including the achievement gallery and progression feedback.
### 05-optional.png
PORTFOLIO_ASSETS/scoundrel-game-pwa/05-optional.png
Optional additional view showing the settings interface or another distinct gameplay state.
### GIF / Video
Not currently available.
### Live Site
https://scoundrel-game-pwa-lilac.vercel.app/
### GitHub
https://github.com/Gustav-DEVhub/scoundrel-game-pwa
## What This Demonstrates to Recruiters
- **Full PWA lifecycle**: manifest, custom SW (precache + runtime), icons, screenshots, installability verified on production aliases
- **Vanilla JS architecture discipline**: 46 KB engine, clean sectioned code, IIFE modules for audio/leaderboard/achievements/particles
- **Web Audio API proficiency**: 13 synthesized SFX + 2-mood looping BGM with cross-fade — no audio files
- **CSS architecture at scale**: 68 KB design system, custom properties, 26 documented sections, responsive breakpoints, prefers-reduced-motion, themed scrollbars, particle keyframes
- **Accessibility-focused implementation**: Skip link, ARIA live/log, focus trapping, semantic landmarks, keyboard + touch parity
- **State persistence design**: Versioned localStorage keys, session resume, atomic saves with UI indicator
- **Deployment awareness**: Documented Vercel-specific PWA caveats (protected URLs vs. production aliases)
## What This Demonstrates to Freelance Clients
- **Complete, polished, installable product** — Works offline after initial load, installs on phone/desktop, persists progress, has sound/juice/achievements
- **Static hosting only** (Vercel free tier), no backend, database, API keys, or server maintenance
- **Privacy-first**: No tracking, accounts, or network calls after initial load; all data stays on device
- **Maintainable codebase**: Clear shell/game separation, documented CSS sections, commented JS modules, asset generation script
- **Cross-device UX**: Responsive to 360px, landscape handling, safe-area insets, ≥44px touch targets, swipe gestures
## Professional Signals
- Public GitHub repository with clean history
- Public Vercel deployment with documented production aliases
- Installable PWA with custom service worker
- Offline capability after initial load
- localStorage persistence (game state, achievements, leaderboard, preferences)
- Procedural Web Audio (13 SFX + 2-mood BGM)
- Responsive desktop/mobile design
- Keyboard and touch interaction
- Accessibility-focused implementation
- Documented Vercel PWA troubleshooting
## Scope & Limitations
- **Scope**: Single-player Scoundrel, offline-capable, local persistence only
- **Limitations**: No cloud sync, no server leaderboard, no multiplayer, no test suite, no CI beyond Vercel, no error reporting, no i18n
- **Browser support**: Requires SW, Cache API, Web Audio, localStorage — modern browsers (last 2–3 years)
## Future Improvements
### Potential Future Improvements
- Unit tests for game logic (deck, weapon rule, scoring)
- CI pipeline (lint/typecheck/build)
- Export/import save file (JSON backup)
- Statistics page (win rate, avg turns, best score)
- Game variant support
- Web Share API for score sharing
## CV Bullet Points
- Built a production PWA (Scoundrel card game) with custom service worker, Web Audio synthesis, and localStorage persistence — core gameplay available offline after first load
- Architected a two-layer React shell / vanilla JS game core pattern enabling framework-agnostic, portable game logic
- Implemented 14-achievement system with toast notifications, procedural particle effects, and responsive 26-section CSS design system
- Delivered zero-backend deployment on Vercel with documented PWA installability verification for production aliases
## LinkedIn Version
🎮 **Scoundrel — Offline-Capable Solo Card Game PWA**  
A complete client-side implementation of the Scoundrel card game rules as an installable Progressive Web App. Built with a minimal React/Vite shell iframing a vanilla JS game core (46 KB, zero deps). Features: custom service worker with precache/runtime strategies, 13 procedural Web Audio SFX + 2-mood BGM, 14 achievements, local leaderboard, full keyboard/touch controls, and responsive design down to 360px. Deployed on Vercel, core gameplay available offline after initial load.  
🔗 Live: https://scoundrel-game-pwa-lilac.vercel.app | GitHub: Gustav-DEVhub/scoundrel-game-pwa
## Portfolio Version
**Scoundrel PWA** — Solo dungeon-crawl card game, offline-capable.  
Vanilla JS game core (46 KB) + React shell. Custom SW caches 23 assets. Procedural Web Audio (13 SFX + adaptive BGM). 14 achievements, leaderboard, localStorage persistence. Installs on mobile/desktop. Responsive, accessibility-focused, no backend.  
[Live Demo] [GitHub] [Screenshot: Desktop] [Screenshot: Mobile]
## Mini Case Study
### Problem
Most digital card games require accounts, servers, and constant connectivity. Scoundrel is inherently single-player with perfect information per room — an ideal fit for an offline-capable PWA.
### Process
Bootstrapped on Vercel, then added PWA layer (manifest, SW, icons, screenshots) in a dedicated commit. Built game logic as vanilla JS in `public/scoundrel/` — iframe-embedded by a 30-line React shell. Chose custom SW over Workbox for precise cache control. Wrote all audio procedurally via Web Audio API to eliminate asset dependencies.
### Solution
A production PWA that installs, works offline after initial load, persists progress locally, and delivers a polished experience: 44-card deck, weapon decay mechanics, particle juice, achievement toasts, leaderboard, settings with volume sliders, accessibility-focused implementation, responsive to 360px.
### Result
Deployed at `scoundrel-game-pwa-lilac.vercel.app`. Static hosting only. Privacy-first (no tracking, no network after initial load). Portable game core (designed for portability to Electron/Capacitor). Documented Vercel PWA caveats for future maintainers.

---

# Project 4: Tonaliz Lite

## Recommended Professional Name

Tonaliz Lite — Independent Music Discovery & Local-First Listening App

## Project Type

Frontend Web Application / Local-First Music Discovery App / PWA

## Status

Phase 1 MVP completed.

Functional QA passed on the final Vercel deployment.

Portfolio-ready MVP. Not production-certified.

## Repository

https://github.com/Gustav-DEVhub/tonaliz-lite

## Deploy

https://tonaliz-lite.vercel.app/

## Professional Summary

Tonaliz Lite is an independent music discovery and listening application built from scratch around a local-first experience.

The product focuses on mood-based music discovery, saved tracks, playlists, saved artists, saved collections, persistent playback, queue management, and a structured Library experience across desktop and mobile.

The project was designed as an original product rather than a direct clone of an existing music platform. Its main product focus is creating clear and predictable semantics for different music-saving and organization actions.

## Problem

Music applications can blur the distinction between liking a track, saving a track, saving an artist, and saving a playlist or collection.

Tonaliz Lite addresses this by giving different entities and actions explicit behaviors.

For example:

- `Music I Like` represents favorite tracks.
- `Songs` is powered by persisted `savedTracks`.
- Saved artists are managed independently.
- Saved collections have their own Library behavior.
- Local playlists remain separate from automatic favorite and saved-track collections.

This approach makes the Library easier to understand and reduces ambiguous or duplicated actions.

## Development Process

The application was developed iteratively around product semantics, state management, persistence, responsive interaction design, and cross-device consistency.

The main development work focused on:

- Separating track, artist, playlist, and collection actions.
- Designing a cards-first Library.
- Introducing persistent `savedTracks`.
- Differentiating `Music I Like` from `Songs`.
- Implementing local playlists and add-to-playlist flows.
- Connecting Shelf Collections with Library behavior.
- Adding saved artists and artist-specific tracks.
- Maintaining consistent player and queue interactions.
- Designing separate interaction surfaces for desktop and mobile.
- Refining contextual menus, popovers, bottom sheets, and player actions.

Final QA focused on resolving issues involving:

- duplicated actions;
- Share and Copy Link behavior;
- Library filtering;
- artist save behavior;
- mobile bottom sheets;
- desktop popovers;
- player and queue consistency;
- responsive behavior;
- final portfolio presentation.

## Final Solution

The completed Phase 1 MVP provides a responsive music discovery and listening experience with:

- Desktop `Home`, `Discover`, and `Library`.
- Mobile `Home`, `Search`, and `Library`.
- Mood-based music discovery.
- Discover shelves backed by Jamendo music data.
- `Music I Like` as the automatic favorite collection.
- `Songs` powered by persisted `savedTracks`.
- Local playlists.
- Saved artists.
- Saved collections.
- Artist pages with dedicated artist tracks.
- Track-level `Save to Library`.
- Artist-level `Save artist`.
- Collection-level `Save to Library`.
- Add-to-playlist functionality.
- Add-to-queue functionality.
- Mini-player.
- Expanded player.
- Queue management.
- Shuffle and repeat.
- Desktop contextual popovers.
- Mobile bottom sheets.
- Responsive desktop/mobile application shell.
- PWA installation configuration.

## Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router

### UI and Design

- Tailwind CSS v4
- Motion for React
- Radix Dialog
- Lucide React

### State Management

- Zustand

### Local Persistence

- Dexie.js
- IndexedDB

### Data and API

- Jamendo-backed music data

### Interaction and Utilities

- DnD Kit

### PWA

- vite-plugin-pwa
- PWA installation configuration

### Deployment

- Vercel

## Architecture & Technical Context

Tonaliz Lite uses a local-first frontend architecture.

Application state is managed with Zustand, while persistent user data is stored in the browser through IndexedDB and accessed through Dexie.js.

The application consumes Jamendo-backed music data rather than operating its own music backend.

There is currently no custom backend, authentication system, user account system, or cloud synchronization layer.

The architecture therefore keeps the primary Library and personalization flows client-side while maintaining distinct data behavior for:

- tracks;
- favorites;
- saved tracks;
- artists;
- collections;
- playlists;
- player state;
- queue interactions.

This separation allows different user actions to remain independent and predictable throughout the application.

## Key Features

### Music Discovery

- Mood-based Home recommendations.
- Discover shelves.
- Jamendo-backed music discovery.
- Search flow.

### Library

- `Music I Like`.
- `Songs`.
- Local playlists.
- Saved artists.
- Saved collections.
- Shelf Collections.
- Library filtering.

### Music Interaction

- Persistent playback.
- Mini-player.
- Expanded player.
- Queue management.
- Shuffle.
- Repeat.
- Add to queue.
- Add to playlist.

### Artist Experience

- Artist pages.
- Artist tracks.
- Save artist.

### Responsive UX

- Desktop navigation.
- Mobile navigation.
- Desktop contextual popovers.
- Mobile bottom sheets.
- Responsive player experience.

### PWA

- PWA installation configuration.
- Application naming and install metadata.

## Key Technical / Product Decision

The core product decision was to separate track, artist, and collection actions so that saving an artist, saving a song, and saving a collection never produce the same data effect.

This decision influenced the data model, persistence layer, Library behavior, contextual actions, player interactions, and responsive UI.

## Director's Note

> Different content types should have different save semantics.

This principle became the foundation for the Library architecture and helped keep user actions predictable across desktop and mobile interfaces.

## Portfolio Assets

### Main Screenshot

`tonaliz-discover-desktop.png`

Desktop Discover view showing populated independent music shelves and the primary discovery experience.

### Secondary Screenshots

`tonaliz-home-mobile.png`

Mobile Home view demonstrating the final mobile navigation model:

- Home
- Search
- Library

`tonaliz-library-desktop.png`

Desktop Library showing:

- Music I Like
- playlists
- saved artists
- saved collections

`tonaliz-artist-desktop.png`

Artist Page for `Fluxo`, showing the artist interaction model and artist tracks.

`tonaliz-player-mobile.png`

Mobile player showing the focused listening experience with active playback.

### GIF / Video

Optional.

Not required for the initial portfolio presentation.

### Live Site

https://tonaliz-lite.vercel.app/

### GitHub

https://github.com/Gustav-DEVhub/tonaliz-lite

## What This Demonstrates to Recruiters

Tonaliz Lite demonstrates practical experience with:

- React application architecture.
- TypeScript.
- State management with Zustand.
- Client-side persistence with IndexedDB and Dexie.js.
- Data modeling for different content entities.
- Responsive desktop/mobile application design.
- Product-oriented UX decisions.
- Contextual action design.
- PWA implementation.
- External API integration.
- Iterative debugging and QA.
- Maintaining consistent behavior across multiple UI surfaces.

The project also demonstrates the ability to translate product requirements into explicit application behavior rather than implementing isolated UI components.

The Library semantics and persistence model provide evidence of working with a moderately complex client-side state domain.

## What This Demonstrates to Freelance Clients

Tonaliz Lite demonstrates the ability to take a product concept from idea to a functional and publicly deployed application.

It shows practical capability in:

- designing interactive web applications;
- implementing responsive interfaces;
- integrating external APIs;
- creating persistent client-side data;
- building playlists and media interaction flows;
- implementing player and queue functionality;
- creating mobile and desktop experiences;
- configuring PWA functionality;
- iterating through QA and refinement;
- documenting the resulting product.

The project provides relevant evidence for freelance frontend and application development work.

## Professional Signals

- Built from scratch as an original product concept.
- Not positioned as a Spotify or YouTube Music clone.
- Functional MVP publicly deployed.
- Local-first architecture.
- Explicit product semantics.
- Responsive desktop/mobile experience.
- Persistent client-side user state.
- Music discovery and player workflows.
- Documented GitHub repository.
- Iterative QA performed against the final deployment.

## Scope & Limitations

Tonaliz Lite should be presented as a completed Phase 1 MVP rather than as a production-scale music streaming platform.

The current scope does not include:

- Backend authentication.
- User accounts.
- Cloud synchronization.
- AI recommendation engine.
- Lyrics.
- Visualizer.
- Offline audio downloads.
- Payment system.
- Production analytics.
- Custom domain.
- Automated test coverage.
- Formal accessibility audit.

These limitations are outside the completed Phase 1 scope and should not be presented as completed functionality.

## Future Improvements

Potential future improvements include:

- Automated tests for stores, repositories, and key UI flows.
- Accessibility audit and refinement.
- Richer recommendation logic.
- Improved artist metadata.
- Additional performance profiling on real mobile devices.
- Optional portfolio GIF/video.
- Future backend and cloud synchronization capabilities.

These items should be presented as potential future development rather than existing functionality.

## CV Bullet Points

- Built and deployed **Tonaliz Lite**, a React/TypeScript music discovery MVP with mood-based discovery, local playlists, saved artists, collections, persistent playback, queue management, and responsive desktop/mobile experiences.
- Designed a **local-first persistence architecture** using Zustand, Dexie.js, and IndexedDB to maintain distinct Library semantics for favorites, saved tracks, artists, collections, and playlists without requiring user accounts.
- Implemented and refined responsive interaction patterns including desktop popovers, mobile bottom sheets, contextual actions, mini-player, expanded player, and queue controls through iterative QA.

## LinkedIn Version

Built Tonaliz Lite from scratch as an independent music discovery MVP focused on local-first listening and clear Library semantics.

The project combines React, TypeScript, Zustand, Dexie.js/IndexedDB, Tailwind CSS, and Jamendo-backed music data.

A major focus was making actions such as favorite, save track, save artist, save collection, playlist management, queue, and playback behave independently and predictably across desktop and mobile.

The result is a functional, publicly deployed Phase 1 MVP with responsive UX and PWA installation support.

## Portfolio Version

### Tonaliz Lite

**An independent music discovery app built from scratch around local-first listening.**

Tonaliz Lite explores how a music product can make discovery, saving, playlists, artists, collections, and playback feel clear and predictable without requiring user accounts or cloud synchronization.

The project was designed around a key principle: different user actions should produce different data effects.

That principle shaped the Library, persistence model, contextual actions, player, queue, and responsive desktop/mobile experience.

**Key areas:**

- Mood-based music discovery.
- Local playlists and saved collections.
- Persistent saved tracks and favorites.
- Saved artists and artist pages.
- Persistent player and queue.
- Responsive desktop/mobile UX.
- Local-first IndexedDB persistence.
- PWA installation support.

**Stack:** React 19 · TypeScript · Zustand · Dexie.js · IndexedDB · Tailwind CSS · Vite · React Router · Vercel

**Live:** https://tonaliz-lite.vercel.app/

**Code:** https://github.com/Gustav-DEVhub/tonaliz-lite

## Mini Case Study

### Problem

Music applications can make different Library actions feel interchangeable. Liking a track, saving a track, saving an artist, or saving a collection can become ambiguous from the user's perspective.

### Process

The application was developed iteratively around explicit product semantics.

The implementation required coordinating persistence, state management, Library filters, contextual actions, player behavior, and responsive interaction surfaces.

QA was then used to identify and resolve inconsistencies such as duplicated actions, ambiguous Share/Copy Link behavior, incorrect Library filtering, and differences between desktop and mobile interaction patterns.

### Solution

Tonaliz Lite implements separate behaviors for tracks, artists, collections, favorites, playlists, player state, and queue interactions.

The resulting Phase 1 MVP provides a responsive music discovery and listening experience with persistent local data, mood-based discovery, playlists, saved artists, collections, artist pages, queue management, and a persistent player.

### Result

A functional, publicly deployed MVP demonstrating practical React/TypeScript development, local-first data persistence, product-oriented UX decisions, responsive application design, and iterative QA.