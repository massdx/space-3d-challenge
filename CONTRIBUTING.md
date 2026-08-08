# Contributing to Descraft

Thanks for taking the time to contribute! 🎉 This document explains how to propose changes and get them merged.

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- 🐛 **Report bugs** — open an issue with clear reproduction steps.
- 💡 **Suggest features** — describe the use case and the problem it solves.
- 🧩 **Add 3D assets** — new furniture/decor (see the asset guidelines below).
- 🛠️ **Fix issues / build features** — pick an open issue or propose your own.
- 📖 **Improve docs** — typos, clarifications and examples are all welcome.

## Development setup

**Prerequisites:** Node.js 20+ and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/massdx/space-3d-challenge.git
cd space-3d-challenge
pnpm install
pnpm dev
```

Before opening a pull request, make sure the project builds and lints cleanly:

```bash
pnpm lint
pnpm build
```

## Branch & PR workflow

1. Fork the repo and create a branch from `develop` (or `main` if `develop` is not present).
2. Use a descriptive branch name, e.g. `feat/tool-wheel`, `fix/wall-snapping`, `docs/readme`.
3. Keep pull requests focused — one logical change per PR.
4. Fill in the PR description: what changed, why, and how to test it. Add screenshots or a short clip for UI/3D changes.
5. Link any related issue (`Closes #123`).

## Commit conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add gaming chair to the catalog
fix: prevent items from clipping through walls
docs: document the scene sharing format
refactor: extract placement footprint helper
chore: bump dependencies
```

## Coding conventions

- **TypeScript everywhere** — prefer explicit, well-typed models over `any`.
- **Feature-sliced structure** — keep domain logic in a feature's `model/` and UI in `ui/`/`components/`. Don't reach across feature boundaries unnecessarily.
- **State with Zustand** — colocate stores with their feature; keep them small and focused.
- **Styling with Tailwind** — use utility classes; extract a component when markup repeats.
- **Comments** — only when the *why* isn't obvious (a hidden constraint or a workaround). Don't restate what the code already shows.
- **Formatting/linting** — run `pnpm lint` and fix warnings before pushing.

## Adding 3D assets

- Place `.glb` models in `public/models/` and register them in
  [src/features/catalog/model/catalog.ts](src/features/catalog/model/catalog.ts)
  with a category, a `targetSize` (largest world dimension, used for auto-scaling) and,
  if it hangs on a wall, `placement: 'wall'`.
- Keep models **low-poly and optimized** — this runs in the browser in real time.
- **Only submit assets you have the right to redistribute.** Preferably CC0 / permissively licensed.
  Preserve the original author's name and provide the source/license in your PR description so
  it can be added to the credits.

## Reporting bugs

A good bug report includes:

- What you did (steps to reproduce)
- What you expected vs. what happened
- Browser / OS
- Console errors and screenshots if relevant

## License

By contributing, you agree that your code contributions are licensed under the
[MIT License](LICENSE), and that any 3D assets you submit are provided under a license
compatible with redistribution.
