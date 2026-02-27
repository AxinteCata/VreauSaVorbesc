# AAC Board – Free Web-Based AAC Application

A **100% free**, privacy-first, web-based **Augmentative and Alternative Communication (AAC)** application for minimally verbal children. Tap symbols to speak (voice output), build simple sentences, and express feelings—all with data stored **only on your device**.

## Goals

1. **Communication aid** – Tap tiles to speak via the Web Speech API.
2. **Learning tool** – Core vocabulary, routines, and simple sentence building.
3. **Emotional expression** – Easy access to feelings and self-regulation phrases.

## Constraints (compliant)

- **Free** – No paywalls or premium features.
- **No IP infringement** – No copying of proprietary vocabulary, layouts, or symbol sets from commercial AAC apps.
- **Open-licensed only** – Code and dependencies use permissive licenses; symbols/media are user-uploaded or openly licensed with attribution.
- **Privacy-by-design** – All data local (IndexedDB/localStorage); no analytics, no tracking.

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Zustand** (state)
- **IndexedDB** via **idb** (storage)
- **Tailwind CSS** (styling, accessible defaults)
- **Vite PWA** (offline support)

## Run locally

```bash
cd aac-app
npm install
npm run dev
```

Open `http://localhost:5173`. Use a tablet or resize the window for a touch-friendly layout.

## Build for production

```bash
npm run build
npm run preview
```

Static output is in `dist/`. Serve over HTTPS for PWA and Speech Synthesis.

### Docker (recommended for preview/deploy)

The image serves the app with nginx and disables caching for `index.html` so users always get the latest bundle after a deploy.

```bash
docker build -t aac-app .
docker run -d -p 4173:80 --name aac-preview aac-app
```

Open `http://localhost:4173`. To see updates after rebuilding: rebuild the image, stop the container, remove it, and run again; or use a single run: `docker build -t aac-app . && docker stop aac-preview; docker rm aac-preview; docker run -d -p 4173:80 --name aac-preview aac-app`.

**If the app still looks old (e.g. no icons on tiles):** do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear site data for the app URL so the browser and service worker load the new code. The app will then run a one-time data upgrade and show the new board with icons.

## PWA (offline and install)

- **Service worker:** App shell and assets are cached (Workbox). No backend.
- **Offline-first:** Boards and images are in IndexedDB. Open once online to cache the shell.
- **Install prompt:** "Install AAC Board" banner on supported browsers; dismiss with "Not now".
- **Offline indicator:** "Offline" pill in the top-right when offline.
- **Voice:** Speech Synthesis may not work offline (depends on OS/browser). Device’s 
## Adding symbol/icon packs legally

- **Your responsibility:** Only use images/symbols you have the right to use (e.g. your own photos, CC0/CC-BY, or other open licenses).
- **No bundled proprietary sets:** This app does not ship or copy any commercial symbol set. Demo boards use **text labels only** (no images).
- **Caregiver editor (future):** You will be able to upload your own images or point to open-licensed assets; attribution and license compliance are your responsibility. A “Content Sources” note is in **Credits & Licenses** in the app.

## Credits & Licenses

In the app: open **Credits & Licenses** (footer link) for:

- App license (MIT)
- Third-party libraries (React, Vite, Zustand, idb, Tailwind, etc.)
- Symbol/image policy and privacy note

## Tests

```bash
npm run test
```

Covers board CRUD and export/import (when implemented).

## License

MIT. See [LICENSE](LICENSE) in the repository.
