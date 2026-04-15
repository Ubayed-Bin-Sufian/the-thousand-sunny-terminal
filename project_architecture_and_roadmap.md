# Project Specification: The Thousand Sunny's Terminal
### Gamedev.js Jam 2026 — Open Source Challenge Entry

---

## 🏴‍☠️ Game Overview

**The Thousand Sunny's Terminal** is a One Piece-themed, terminal-puzzle HTML5 game for the **Gamedev.js Jam 2026**. The Thousand Sunny has been critically damaged mid-voyage. Each crew member has reported a failing ship system. The player assumes the role of the crew's emergency engineer — using a Linux-style command-line terminal to diagnose, repair, and restore all systems before the ship goes down.

**Tech Stack:** Phaser 3 + TypeScript + Vite 5
**Theme Alignment:** Operating and repairing ship machinery — fulfills "Machines" at a systems level.
**Target Challenges:** Open Source by GitHub ✅ · Build it with Phaser ✅

---

## 🎮 Core Gameplay Loop

```
Player opens terminal
  → Types a Linux-style command
    → CommandParser.ts validates and maps to a typed GameAction
      → PuzzleEngine.ts evaluates against the active system's win condition
        → MachineSystem.ts updates Readonly<ShipState>
          → Renderer.ts reflects new state in the Phaser scene
            → DialogueManager.ts triggers crew reaction dialogue
              → Next puzzle unlocks or victory condition triggers
```

The player wins when all 5–6 ship systems are repaired and the final score is submitted to the GitHub leaderboard.

---

## 🧩 Ship Systems — Puzzle Rooms (5–6 Scope)

Each system is a self-contained puzzle room with a unique crew member, Linux command mechanic, and failure narrative.

### System 1 — Engine Room · Luffy
- **Failure Story:** The Gum-Gum engine is out of cola. Luffy keeps yelling "I'M HUNGRY" into the terminal.
- **Core Command:** `mv cola_barrel_3 /engine/slot_1`
- **Win Condition:** All 3 cola barrels moved to the correct engine slots.
- **Hint (Luffy):** "Oi! The cola things go in the slot things! EASY!"
- **Teaches:** `mv`, file paths, directory structure
- **Difficulty:** Tutorial — the first room, designed to feel immediately rewarding

### System 2 — Navigation Room · Nami
- **Failure Story:** The Log Pose data files are corrupted and weather scripts have wrong permissions.
- **Core Commands:** `chmod +x weather_forecast.sh` · `grep "storm" ship_logs.txt`
- **Win Condition:** Fix file permissions and locate the hidden storm warning in the logs.
- **Hint (Nami):** "If you break my maps, I will charge you 50,000 Berries per file."
- **Teaches:** `chmod`, `grep`, reading file output
- **Difficulty:** Easy

### System 3 — Weapon Bay · Usopp
- **Failure Story:** The Gaon Cannon firing script is non-executable. The slingshot calibration config has wrong values.
- **Core Commands:** `chmod +x gaon_cannon.sh` · `sed -i 's/RANGE=50/RANGE=5000/' slingshot.conf`
- **Win Condition:** Make the script executable and patch the config value correctly.
- **Hint (Usopp):** "I, the Great Captain Usopp, have faced 8000 enemies — but this terminal is something else."
- **Teaches:** `sed` inline editing, config file manipulation
- **Difficulty:** Medium

### System 4 — Medical Bay · Chopper
- **Failure Story:** The medical database is unsorted. Critical cure files are buried in a chaotic directory.
- **Core Commands:** `ls -la /medical/` · `find /medical -name "*.cure" -type f` · `sort patient_vitals.log`
- **Win Condition:** Find all `.cure` files and sort the vitals log correctly.
- **Hint (Chopper):** "I'm not happy that you're praising my terminal skills! ...Okay maybe a little."
- **Teaches:** `find`, `ls` flags, `sort`
- **Difficulty:** Medium

### System 5 — Library / Poneglyph Decoder · Robin
- **Failure Story:** The ship's archaeological data is encrypted. The decryption key is fragmented across multiple files.
- **Core Commands:** `cat fragment_*.txt > key.txt` · `diff encoded.txt decoded_attempt.txt`
- **Win Condition:** Concatenate all key fragments correctly and verify with `diff`.
- **Hint (Robin):** "History always leaves traces. You simply need to know where to look."
- **Teaches:** `cat` with glob, output redirection (`>`), `diff`
- **Difficulty:** Hard

### System 6 — Kitchen / Fuel Synthesizer · Sanji *(Stretch Goal)*
- **Failure Story:** The kitchen's automated fuel synthesis pipeline has broken environment variables. The recipe scripts won't run.
- **Core Commands:** `export FUEL_GRADE=premium` · `env | grep FUEL` · `./synthesize_fuel.sh`
- **Win Condition:** Set the correct environment variable and successfully execute the synthesis script.
- **Hint (Sanji):** "Only I understand the precise conditions needed for the perfect fuel — just like the perfect meal."
- **Teaches:** `export`, `env`, shell script execution
- **Difficulty:** Hard

> **Post-Jam Bonus:** Zoro's Sword Calibration room — involves `cron` jobs and deliberate directory navigation puzzles, reflecting Zoro's legendary sense of direction.

---

## 🏗️ Architecture — Module Map

### Directory Structure
```
the-thousand-sunny-terminal/
├── src/
│   ├── types/
│   │   └── index.ts              # All shared interfaces and type aliases — edited here only
│   ├── core/
│   │   ├── TerminalController.ts # Input, history, sanitization — nothing else
│   │   ├── CommandParser.ts      # Token → GameAction mapping — pure function, no side effects
│   │   ├── MachineSystem.ts      # ShipState machine — no rendering, no API calls
│   │   ├── PuzzleEngine.ts       # Win/fail logic per system, progress tracking
│   │   └── GameLogger.ts         # Structured JSON logging with crew flavour
│   ├── content/
│   │   ├── DialogueManager.ts    # All crew dialogue trees
│   │   └── puzzles/
│   │       ├── EngineRoom.ts     # Luffy puzzle — commands + win state definition
│   │       ├── NavigationRoom.ts # Nami puzzle
│   │       ├── WeaponBay.ts      # Usopp puzzle
│   │       ├── MedicalBay.ts     # Chopper puzzle
│   │       ├── Library.ts        # Robin puzzle
│   │       └── Kitchen.ts        # Sanji puzzle (stretch)
│   ├── rendering/
│   │   ├── Renderer.ts           # Phaser orchestration — reads ShipState, never mutates it
│   │   ├── scenes/
│   │   │   ├── BootScene.ts      # Asset preloading only
│   │   │   ├── MenuScene.ts      # Title screen
│   │   │   ├── TerminalScene.ts  # Main gameplay scene
│   │   │   ├── SystemMapScene.ts # Ship overview — repair progress per system
│   │   │   └── VictoryScene.ts   # End screen + leaderboard submission trigger
│   │   └── ui/
│   │       ├── TerminalUI.ts     # Phaser CRT terminal rendering
│   │       └── CrewPortrait.ts   # Animated crew character display per room
│   ├── api/
│   │   └── GitHubIntegration.ts  # All Octokit calls — leaderboard only
│   ├── audio/
│   │   └── SoundManager.ts       # BGM loops, SFX triggers — no game logic
│   └── config/
│       ├── constants.ts          # Game-wide constants (system names, score weights)
│       └── environment.ts        # dotenv loader + MissingEnvVarError validation
├── .github/
│   ├── workflows/
│   │   ├── codeql.yml            # CodeQL scan on every push to main
│   │   └── deploy.yml            # GH Pages deployment on tagged release
│   └── dependabot.yml            # Weekly npm dependency updates
├── .devcontainer/
│   └── devcontainer.json         # For contributors using VS Code Dev Containers
├── Dockerfile                    # Multi-stage: Node builder → Nginx production
├── docker-compose.yml            # Contributors only — not for user's daily dev
├── nginx.conf                    # Production web server config with CSP headers
├── tsconfig.json                 # Strict TypeScript config
├── vite.config.ts                # Vite bundler config
├── package.json                  # All dependencies declared explicitly
├── .env.example                  # Safe template — committed to repo
├── .env                          # Real secrets — gitignored
├── .gitignore
├── LICENSE                       # MIT
├── README.md                     # For players: what it is, how to play, screenshots
├── CONTRIBUTING.md               # For devs: Node.js setup, Docker setup, PR guide
└── CODE_OF_CONDUCT.md
```

**SRP Enforcement Rule:** If any `.ts` file imports from more than 2 other local modules, review for SRP violation before proceeding.

---

## 🔷 TypeScript Architecture

### Core Interfaces (`src/types/index.ts`)
```typescript
export type SystemName =
  | 'engine_room' | 'navigation' | 'weapon_bay'
  | 'medical_bay' | 'library'   | 'kitchen';

export type CrewMember = 'luffy' | 'nami' | 'usopp' | 'chopper' | 'robin' | 'sanji';

export interface ShipState {
  readonly systems: Record<SystemName, SystemStatus>;
  readonly activeSystem: SystemName | null;
  readonly crewDialogue: DialogueLine | null;
}

export interface SystemStatus {
  readonly health: number;       // 0–100
  readonly isRepaired: boolean;
  readonly assignedCrew: CrewMember;
}

export interface GameAction {
  readonly command: string;      // "mv", "chmod", "grep", etc.
  readonly args: readonly string[];
  readonly rawInput: string;
}

export interface PuzzleResult {
  readonly success: boolean;
  readonly feedback: string;     // shown in terminal
  readonly crewReaction?: string;
}

export interface LeaderboardEntry {
  readonly playerName: string;
  readonly score: number;
  readonly timeSeconds: number;
  readonly commandCount: number;
  readonly submittedAt: string;  // ISO 8601
}
```

### Phaser Scene Pattern
```typescript
import Phaser from 'phaser';
import type { ShipState } from '@types/index';

export class TerminalScene extends Phaser.Scene {
  private shipState!: ShipState;  // initialised in create()

  constructor() { super({ key: 'TerminalScene' }); }

  preload(): void { /* load assets only */ }
  create(): void  { /* one-time setup, init state */ }
  update(): void  { /* per-frame logic only */ }
}
```

---

## ⚙️ 12-Factor Implementation

### Factor III — Config
```typescript
// src/config/environment.ts
class MissingEnvVarError extends Error {
  constructor(varName: string) {
    super(`⚓ [Nami] CRITICAL: Missing env var "${varName}". Check your .env file.`);
  }
}

const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new MissingEnvVarError(key);
  return value;
};

export const ENV = {
  GITHUB_PAT:        requireEnv('VITE_GITHUB_PAT'),
  LEADERBOARD_REPO:  requireEnv('VITE_LEADERBOARD_REPO'),
  GAME_ENV:          import.meta.env['VITE_GAME_ENV'] ?? 'development',
} as const;
```

```bash
# .env.example — committed, safe template
VITE_GITHUB_PAT=your_token_here
VITE_LEADERBOARD_REPO=your-username/sunny-leaderboard
VITE_GAME_ENV=development
```

### Factor V — Build, Release, Run
```dockerfile
# Dockerfile — contributors only
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```nginx
# nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    add_header Content-Security-Policy "default-src 'self'; connect-src api.github.com;";
    add_header X-Frame-Options "SAMEORIGIN";
}
```

### Factor XI — Structured Logs
```typescript
// src/core/GameLogger.ts
import type { CrewMember } from '@types/index';
type LogLevel = 'info' | 'warn' | 'error';

export const GameLogger = {
  info:  (crew: CrewMember, msg: string): void =>
    console.info (JSON.stringify({ level: 'info',  crew, msg, ts: Date.now() })),
  warn:  (crew: CrewMember, msg: string): void =>
    console.warn (JSON.stringify({ level: 'warn',  crew, msg, ts: Date.now() })),
  error: (crew: CrewMember, msg: string): void =>
    console.error(JSON.stringify({ level: 'error', crew, msg, ts: Date.now() })),
};
```

---

## 🏆 GitHub Leaderboard Architecture

The leaderboard requires **zero backend**. All logic runs through the GitHub API:

### How It Works
1. Player finishes all puzzles → `VictoryScene.ts` calculates final score
2. Score formula: `score = 10000 - (timeSeconds × 2) - (commandCount × 10)`
3. `GitHubIntegration.ts` fires a `repository_dispatch` event to a dedicated GitHub Actions workflow
4. The GitHub Actions workflow (holding the PAT as a GitHub Secret) creates a new GitHub Issue in the leaderboard repo with a structured label (`score:4200`, `time:312s`)
5. On load, the game reads the leaderboard by fetching issues from the public repo — no auth required for reads

### Why This Approach
- GitHub PAT **never** enters the browser bundle
- Leaderboard data is **publicly auditable** (it's just GitHub Issues)
- Zero hosting cost, zero server maintenance
- Perfectly aligned with the Open Source Challenge — GitHub is a Gold sponsor of the jam

```typescript
// src/api/GitHubIntegration.ts (read path — no auth needed)
import { Octokit } from '@octokit/rest';
import type { LeaderboardEntry } from '@types/index';

const octokit = new Octokit(); // unauthenticated for reads

export const fetchLeaderboard = async (repo: string): Promise<LeaderboardEntry[]> => {
  const [owner, repoName] = repo.split('/');
  const { data } = await octokit.issues.listForRepo({
    owner: owner ?? '',
    repo: repoName ?? '',
    labels: 'leaderboard-entry',
    state: 'open',
    per_page: 10,
    sort: 'created',
    direction: 'desc',
  });
  // parse structured labels into LeaderboardEntry[]
  return data.map(parseIssueToEntry);
};
```

---

## 🗺️ Roadmap — 12-Day Sprint

### Phase 1 — Foundation (Days 1–2)
- [ ] Repo init: MIT license, `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- [ ] Phaser 3 + TypeScript + Vite scaffold via official template
- [ ] `tsconfig.json` with strict mode configured
- [ ] `src/types/index.ts` — all interfaces defined before any implementation
- [ ] `constants.ts` and `environment.ts` scaffolded
- [ ] `.env.example` committed, `.env` gitignored
- [ ] GitHub Actions: `codeql.yml` + `deploy.yml`
- [ ] Dependabot config (`.github/dependabot.yml`)
- [ ] Docker + `.devcontainer` setup for contributors
- [ ] GitHub Issues + Project Board created for all phases

### Phase 2 — Core Logic (Days 3–5)
- [ ] `TerminalController.ts`: Input capture, history (↑↓ arrows), `sanitize()` utility
- [ ] `CommandParser.ts`: Tokenizer → typed `GameAction`
- [ ] `MachineSystem.ts`: `Readonly<ShipState>` with all 6 systems initialised
- [ ] `PuzzleEngine.ts`: Abstract `Puzzle` interface + Engine Room (Luffy) implementation
- [ ] `GameLogger.ts`: Structured JSON logger
- [ ] `DialogueManager.ts`: Luffy and Nami dialogue trees
- [ ] Vitest unit tests for `CommandParser` and `PuzzleEngine`

### Phase 3 — Remaining Puzzles (Days 5–7)
- [ ] Navigation Room (Nami) — `chmod`, `grep`
- [ ] Weapon Bay (Usopp) — `chmod`, `sed`
- [ ] Medical Bay (Chopper) — `find`, `ls`, `sort`
- [ ] Library (Robin) — `cat` glob, `diff`
- [ ] All dialogue trees complete for all 5 active characters
- [ ] `SystemMapScene.ts`: Ship overview showing repair progress

### Phase 4 — Visuals & Audio (Days 7–9)
- [ ] Asset integration from KingBell itch.io pixel art pack
- [ ] `TerminalScene.ts`: Full CRT-style terminal aesthetic in Phaser
- [ ] `CrewPortrait.ts`: Animated crew character portrait per active room
- [ ] `BootScene.ts` and `MenuScene.ts` with One Piece title treatment
- [ ] `SoundManager.ts`: Sea shanty BGM loop, SFX per crew member, keypress sounds
- [ ] Screen shake on system failure events via Phaser camera effects

### Phase 5 — Leaderboard & Victory (Days 9–11)
- [ ] `GitHubIntegration.ts`: Score submission via `repository_dispatch`
- [ ] GitHub Actions leaderboard workflow (PAT stored as GitHub Secret)
- [ ] `VictoryScene.ts`: Full crew dialogue, score display, leaderboard submit button
- [ ] Leaderboard read view with top 10 scores
- [ ] Kitchen puzzle — Sanji (stretch goal, implement if time allows)

### Phase 6 — Polish & Submission (Days 11–13)
- [ ] Puzzle balance pass — tune command difficulty and hint timing
- [ ] Mobile layout check for YouTube Playables compatibility
- [ ] `README.md` final update: gameplay GIF, "How to Play" section, screenshots
- [ ] Final CodeQL scan — zero unresolved findings
- [ ] GH Pages deployment verified end-to-end
- [ ] Itch.io submission page: description, tags, screenshots, playable embed

---

## 📜 Command Reference

| Command | System | Teaches |
|---|---|---|
| `mv cola_barrel /engine/slot_1` | Engine Room | File movement, paths |
| `chmod +x weather_forecast.sh` | Navigation | File permissions |
| `grep "storm" ship_logs.txt` | Navigation | Text search |
| `chmod +x gaon_cannon.sh` | Weapon Bay | Permissions (reinforced) |
| `sed -i 's/RANGE=50/RANGE=5000/' slingshot.conf` | Weapon Bay | Stream editing |
| `find /medical -name "*.cure" -type f` | Medical Bay | File search with filters |
| `sort patient_vitals.log` | Medical Bay | Sorting |
| `cat fragment_*.txt > key.txt` | Library | Concatenation + glob + redirection |
| `diff encoded.txt decoded_attempt.txt` | Library | File comparison |
| `export FUEL_GRADE=premium` | Kitchen | Environment variables |
| `git checkout stable_version` | Any Room | Puzzle reset mechanic |

---

## 🔐 Security Checklist

- [ ] GitHub PAT never in browser bundle — `repository_dispatch` + GitHub Actions only
- [ ] All terminal input sanitized via typed `sanitize(input: string): string`
- [ ] `Content-Security-Policy` header active in `nginx.conf`
- [ ] `X-Frame-Options: SAMEORIGIN` header in `nginx.conf`
- [ ] CodeQL workflow running on every push to `main`
- [ ] Dependabot weekly updates for `npm` ecosystem
- [ ] No `eval()` or `Function()` constructor anywhere in the codebase
- [ ] `.env` in `.gitignore` from the very first commit
- [ ] `noUncheckedIndexedAccess: true` in `tsconfig.json` — all array access guarded

---

## 🏆 Judging Criteria Alignment

| Criterion | Our Approach |
|---|---|
| **Innovation** | Linux terminal commands as browser game puzzles — rare and genuinely educational |
| **Theme** | Ship = machine; every puzzle = a broken mechanical or digital system requiring repair |
| **Gameplay** | Progressive Linux skill curve — players learn real commands through play |
| **Graphics** | Pixel art crew portraits, CRT terminal aesthetic, Phaser particle effects on repair |
| **Audio** | Sea shanty BGM, per-crew SFX, satisfying terminal keypress sounds |
| **Open Source** | MIT license, public repo, CONTRIBUTING.md, CodeQL, Dependabot — full compliance |
