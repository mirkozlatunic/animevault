# ⚔️ AnimeVault

**The definitive ranking of the 30 greatest anime series of all time — with iconic motivational quotes you can copy and share.**

> Live site → **[animevault-chi.vercel.app](https://animevault-chi.vercel.app)**

## Screenshots

<!-- Add screenshots here -->

---

## What is AnimeVault?

AnimeVault is a single-page web app built for anime fans who want to explore the greatest series ever made and discover the quotes that defined them. Every entry is ranked, rated, tagged by genre, and loaded with real iconic lines from the show.

No accounts. No backend. No clutter. Just anime and words worth remembering.

---

## Features

### Anime Rankings
- 30 ranked entries covering Action, Adventure, Drama, Fantasy, Sci-Fi, Comedy, Thriller, and Romance
- Each card shows the rank, title, genre tags, a short description, and a star rating out of 5
- Every anime has its own unique accent color used throughout the card and modal

### Search & Filter
- Live search by anime title
- Filter by genre — results update instantly
- Clear filters in one click

### Quote Modal
- Click any anime card to open a modal with 2–3 iconic quotes from that series
- Each quote shows the text, character name, and anime title
- **Copy Quote** — copies the formatted quote to your clipboard: `"Quote" — Character, Anime Title`
- **Share** — shares to Twitter/X with the quote pre-filled, or triggers the native Web Share API on mobile

### Quote Wall
- A separate section that collects all 90 quotes from all 30 anime in one masonry grid
- Filter by a specific anime or browse everything at once
- Hover over any card to reveal copy and share buttons

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev) | UI and state management |
| [Vite](https://vitejs.dev) | Dev server and production bundler |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Google Fonts](https://fonts.google.com) | Bebas Neue · Rajdhani · DM Sans |

All anime and quote data is hardcoded in `src/data/anime.js` — no API, no database.

---

## Project Structure

```
animevault/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Root component, routing between views
    ├── index.css             # Tailwind directives + custom animations
    ├── data/
    │   └── anime.js          # All 30 anime entries with quotes
    └── components/
        ├── Header.jsx        # Fixed navigation bar
        ├── SearchFilter.jsx  # Search input + genre filter chips
        ├── AnimeCard.jsx     # Individual ranked anime card
        ├── QuoteModal.jsx    # Quote modal with copy/share actions
        └── QuoteWall.jsx     # Masonry quote grid section
```

---

## Running Locally

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Clone the repo
git clone https://github.com/mirkozlatunic/animevault.git
cd animevault

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other commands

```bash
npm run build    # Production build → outputs to dist/
npm run preview  # Preview the production build locally
```

---

## Deployment

The site is deployed on **Vercel** with automatic deploys from the `main` branch.

To deploy your own fork:

1. Fork this repo on GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your fork — Vercel auto-detects Vite
4. Keep the defaults (build command: `npm run build`, output: `dist`)
5. Click **Deploy**

Every `git push` to `main` will trigger a new deploy automatically.

---

## Anime Included

| # | Title | Rating |
|---|-------|--------|
| 1 | Fullmetal Alchemist: Brotherhood | ★ 4.9 |
| 2 | Attack on Titan | ★ 4.9 |
| 3 | Death Note | ★ 4.8 |
| 4 | Naruto: Shippuden | ★ 4.7 |
| 5 | One Piece | ★ 4.8 |
| 6 | Hunter x Hunter (2011) | ★ 4.9 |
| 7 | Steins;Gate | ★ 4.9 |
| 8 | Cowboy Bebop | ★ 4.8 |
| 9 | Violet Evergarden | ★ 4.8 |
| 10 | Demon Slayer: Kimetsu no Yaiba | ★ 4.8 |
| 11 | Your Lie in April | ★ 4.7 |
| 12 | Dragon Ball Z | ★ 4.6 |
| 13 | Neon Genesis Evangelion | ★ 4.8 |
| 14 | My Hero Academia | ★ 4.6 |
| 15 | Code Geass | ★ 4.8 |
| 16 | Vinland Saga | ★ 4.9 |
| 17 | Mob Psycho 100 | ★ 4.8 |
| 18 | JoJo's Bizarre Adventure | ★ 4.7 |
| 19 | Berserk | ★ 4.8 |
| 20 | Gintama | ★ 4.8 |
| 21 | Re:Zero | ★ 4.7 |
| 22 | Gurren Lagann | ★ 4.8 |
| 23 | Sword Art Online | ★ 4.3 |
| 24 | Tokyo Ghoul | ★ 4.4 |
| 25 | Fate/Zero | ★ 4.8 |
| 26 | Made in Abyss | ★ 4.8 |
| 27 | Black Clover | ★ 4.4 |
| 28 | Overlord | ★ 4.5 |
| 29 | That Time I Got Reincarnated as a Slime | ★ 4.4 |
| 30 | Trigun | ★ 4.7 |

---

## What I Learned

- Component-driven UI architecture with reusable cards, modals, and filter controls
- Clipboard API and Web Share API integration for cross-platform copy/share functionality
- Responsive masonry grid layouts with CSS and Tailwind for varying content heights
- Designing a data-driven app around a single static dataset with no backend dependencies

## Roadmap

- [ ] Add character profile pages with voice actor info and episode appearances
- [ ] User-submitted quotes with an upvote system (would require a backend)
- [ ] Anime recommendation engine based on genre preferences

---

## License

MIT — free to use, fork, and build on.
