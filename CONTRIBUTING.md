# Contributing to Porthole

Thanks for your interest in contributing! Here's how to get started.

## Development setup

1. Install [Rust](https://rustup.rs/) (stable toolchain)
2. Install [Node.js](https://nodejs.org/) 18+ and [pnpm](https://pnpm.io/)
3. Clone the repo and install dependencies:

```bash
git clone https://github.com/poopdeck/porthole.git
cd porthole
pnpm install
```

4. Start the dev server:

```bash
pnpm dev
```

## Project structure

```
src/                    # React frontend
  components/           # UI components
  hooks/                # React hooks (usePorts, useSettings)
  lib/                  # Tauri command wrappers
src-tauri/              # Rust backend
  src/
    lib.rs              # App setup, tray icon, window management
    commands.rs         # Tauri command handlers
    lsof.rs             # Port detection via lsof
    killer.rs           # Process termination (SIGTERM/SIGKILL)
    labels.rs           # Port label persistence
    settings.rs         # App settings persistence
    stack.rs            # Tech stack detection
```

## Making changes

1. Create a branch from `main`
2. Make your changes
3. Test manually with `pnpm dev`
4. Submit a pull request

## Guidelines

- Keep the UI minimal — Porthole is a utility, not a dashboard
- Frontend changes should work in both light and dark mode
- Use the `neutral` Tailwind color palette (not `gray`, which has a blue tint)
- Rust code should handle errors gracefully — never panic in command handlers
- Port detection and process killing are macOS-specific; if adding Linux/Windows support, use conditional compilation (`#[cfg(target_os = "...")]`)

## Adding stack detection

To recognize a new tech stack, edit `src-tauri/src/stack.rs`:

1. Add a variant to the `StackType` enum
2. Add detection logic in `detect_stack()`
3. Add an icon/color in `src/components/StackIcon.tsx`

## Reporting issues

Open an issue with:
- macOS version
- Steps to reproduce
- Expected vs actual behavior
