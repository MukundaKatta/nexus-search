# Contributing to Nexus Search

Thanks for your interest in contributing to Nexus Search, an AI-powered
search experience built with Next.js, React, and TypeScript. This guide
explains how to set up the project locally and submit changes.

## Tech Stack

- **Next.js 16** (App Router) with **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** for styling
- **Zustand** for client state
- **Anthropic AI SDK** (`@ai-sdk/anthropic`, `ai`) for AI answers
- **better-sqlite3** for local search history storage
- **cheerio** for HTML parsing

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file and fill in the required values:

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000.

## Available Scripts

- `npm run dev` — start the local development server.
- `npm run build` — create a production build.
- `npm run start` — run the production build locally.

## Development Workflow

1. Create a branch off `main` for your change:

   ```bash
   git checkout -b feature/short-description
   ```

2. Make your changes in focused, logically separate commits.
3. Verify the project builds before opening a pull request:

   ```bash
   npm run build
   ```

4. Push your branch and open a pull request against `main`.

## Pull Request Guidelines

- Keep pull requests small and focused on a single concern.
- Write a clear title and description explaining the motivation and the
  change.
- Reference any related issues in the description.
- Ensure `npm run build` passes and the code is type-safe.
- Follow the existing code style and project structure (components in
  `src/components`, hooks in `src/hooks`, library code in `src/lib`).

## Code Style

- Use TypeScript for all new code; avoid `any` where a concrete type
  is reasonable.
- Prefer functional React components and hooks.
- Keep components small and composable.
- Match the formatting of the surrounding code.

## Reporting Issues

When filing an issue, please include:

- A clear description of the problem or feature request.
- Steps to reproduce (for bugs).
- Expected versus actual behavior.
- Relevant environment details (OS, Node.js version, browser).

## License

By contributing, you agree that your contributions will be licensed
under the same license as this project (see the `LICENSE` file).
