# Contributing to The Thousand Sunny's Terminal

First off, thank you for considering contributing to the project! This game is built entirely in the open for the Gamedev.js Jam 2026.

## 🛠️ Getting Started

### Prerequisites (Node.js Setup)
If you have Node.js installed locally:
1. Ensure you have **Node.js v20+** installed.
2. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/your-username/the-thousand-sunny-terminal.git
   cd the-thousand-sunny-terminal
   npm install
   ```
3. Copy `.env.example` to `.env` (it doesn't need real keys for local parsing).
4. Run the dev server:
   ```bash
   npm run dev
   ```

### 🐳 Docker & DevContainers Setup
Don't want to install Node.js? We heavily support Docker for isolated development!

**Using Docker Compose:**
```bash
docker-compose up --build
```
This builds an Nginx image serving the `dist` folder on port 80.

**Using VS Code DevContainers:**
Just open the project in VS Code and click "Reopen in Container". Ensure the DevContainers extension is installed. The environment will auto-configure Node.js and TypeScript.

---

## 🏛 Architecture & Guidelines

We strictly follow the **Single Responsibility Principle (SRP)** and a **Strict TypeScript** environment.

- **No `any` allowed:** Use strict typings or `unknown` with type guards. If `any` is absolutely required, it must have an inline `// reason:` comment.
- **Phaser 3 Architecture:** All scenes must explicitly define `preload()`, `create()`, and `update()` with `void` return types.
- **Interfaces First:** Any new data model must be defined in `src/types/index.ts` first.
- **Security:** Do not expose secrets or use `eval()`. 

## 📝 Pull Request Process

1. Explore the [Issues](#) board to find an open task.
2. Fork the repo and create your branch (`git checkout -b feature/amazing-feature`).
3. Write clean, strictly-typed code.
4. Pass all tests: `npm run test` (if applicable) and type checks (`npm run build`).
5. Open a Pull Request targeting the `main` branch. A maintainer will review it.

## 🐞 Reporting Bugs
If you spot a bug in a puzzle or a console error, please open a fresh Issue using the `bug` label. Provide reproduction steps and browser details.

Thank you! SUPER!
