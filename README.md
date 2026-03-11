# Porthole

A lightweight macOS menu bar app that shows every active localhost TCP port at a glance. Built with Tauri v2, React, and TypeScript.

![macOS](https://img.shields.io/badge/platform-macOS-lightgrey)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Live port monitoring** — Polls `lsof` to detect all TCP LISTEN ports on your machine
- **Stack detection** — Automatically identifies Node, Next.js, Vite, Python, Rails, Postgres, Redis, Mongo, Java, PHP, Bun, Deno, and more
- **Custom labels** — Click any port's process name to give it a memorable nickname
- **One-click actions** — Open `localhost:<port>` in your browser or kill a process directly
- **Dark mode** — Follows your system theme or set it manually
- **Minimal footprint** — Lives in the menu bar, hidden from the Dock

## Install

### Download

Grab the latest `.dmg` from [Releases](../../releases).

### Build from source

**Prerequisites:**

- [Rust](https://rustup.rs/) (stable)
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)

```bash
# Clone the repo
git clone https://github.com/poopdeck/porthole.git
cd porthole

# Install frontend dependencies
pnpm install

# Build the app
pnpm build
```

The `.dmg` and `.app` bundle will be in `src-tauri/target/release/bundle/`.

## Development

```bash
pnpm install
pnpm dev
```

This starts both the Vite dev server (with HMR) and the Tauri window.

## Tech stack

| Layer    | Tech                             |
|----------|----------------------------------|
| Runtime  | [Tauri v2](https://v2.tauri.app) |
| Frontend | React 18 + TypeScript            |
| Styling  | Tailwind CSS                     |
| Icons    | [Lucide](https://lucide.dev)     |
| Backend  | Rust (`lsof` / `ps` parsing)    |

## Platform support

Porthole currently supports **macOS only**. Port detection relies on `lsof` and process management uses POSIX signals (`SIGTERM`/`SIGKILL`), both of which are macOS/Linux-specific.

Linux support is possible with minimal changes (the core `lsof`/`ps` commands work the same). Windows would require a different backend using `netstat` or the Windows API. Contributions welcome.

## How it works

1. A background thread runs `lsof -i -P -n -sTCP:LISTEN` on a configurable interval (default 5s)
2. Output is parsed to extract port, PID, and process name
3. `ps -p <PID> -o command=` fetches the full command line for stack detection
4. Results are emitted to the React frontend via Tauri's event system
5. Labels are persisted to `~/.config/porthole/labels.json`
6. Settings are stored in `~/.config/porthole/settings.json`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, guidelines, and how to submit changes.

## License

[MIT](LICENSE)
