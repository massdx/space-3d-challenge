# Descraft

**Design and customize your dream developer workspace in 3D — right in the browser.**

Descraft is an interactive 3D configurator where you drag furniture into a room, arrange desks, chairs, monitors and decor, paint the walls and floor, switch the ambience, and share your setup with a single link. No install, no account — everything runs client-side.

> Built as a challenge project (`space-3d-challenge`) and now open source.

---

##  Features

- **Drag & drop catalog** — desks, chairs, monitors, keyboards, sofas, lamps, rugs and decor, dropped straight into the scene.
- **Free placement & editing** — move, rotate, scale, lock and delete placed items with snapping to the floor.
- **Wall-mounted items** — clocks, frames and shelves auto-attach to walls.
- **Room customization** — repaint each surface (left wall, right wall, floor) with solid colors or textures, and toggle a window side.
- **Ambience presets** — switch the environment lighting between `sunset` and `night`.
- **Radial tool wheel** — quick contextual actions on the selected object.
- **Shareable scenes** — the whole layout is encoded into a compact URL hash; open the link and the scene rebuilds itself.
- **Import / export JSON** — save a configuration to disk and load it back later.
- **Lo-fi ambience** — optional background audio to set the mood.

##  Tech stack

| Layer            | Choice                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Framework        | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build tool       | [Vite](https://vite.dev)                                              |
| 3D rendering     | [Three.js](https://threejs.org) via [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) |
| 3D helpers       | [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) |
| State management | [Zustand](https://github.com/pmndrs/zustand)                          |
| Styling          | [Tailwind CSS 4](https://tailwindcss.com)                            |
| UI primitives    | [Radix UI](https://www.radix-ui.com), [Hugeicons](https://hugeicons.com) |
| Animation        | [Motion](https://motion.dev)                                         |
| Linting          | [ESLint](https://eslint.org) + [typescript-eslint](https://typescript-eslint.io) |

##  Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 20+ (LTS recommended)
- [pnpm](https://pnpm.io) (the repo ships a `pnpm-lock.yaml`)

### Install & run

```bash
pnpm install
pnpm dev
```

Then open the URL printed in the terminal (defaults to `http://localhost:5173`).

### Available scripts

| Command        | Description                                  |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | Start the Vite dev server with HMR           |
| `pnpm build`   | Type-check (`tsc -b`) and build for production |
| `pnpm preview` | Preview the production build locally         |
| `pnpm lint`    | Run ESLint across the project                |

##  Project structure

The codebase follows a lightweight **feature-sliced** layout: each feature owns its `model/` (state, domain logic) and its UI (`ui/` or `components/`).

```
src/
├── app/                      # App shell / composition root
│   └── App.tsx
├── components/ui/            # Reusable primitives (button, popover…)
├── features/
│   ├── catalog/              # Furniture catalog, drag & drop, placement
│   │   ├── model/            #   catalog data, stores, footprint, share codec
│   │   └── ui/               #   panel, thumbnails, 3D models, placed items
│   ├── room/                 # Room shell (walls, floor container)
│   └── workspace/            # Scene, camera, controls, textures, settings
│       ├── model/            #   workspace/viewport/tool-wheel stores, types
│       └── components/       #   scene, header, controls, dialogs
└── lib/                      # Shared utilities
public/
├── models/                   # .glb 3D assets
├── textures/                 # surface textures
└── audio/                    # lo-fi ambience track
```

##  How scene sharing works

A placed scene is serialized into a compact array per item — `[modelId, x, y, z, rotationY, scale, locked]` — versioned, rounded and clamped, then encoded into the URL hash. On load, the app reads the hash, validates every item against the catalog (unknown models and out-of-bounds values are rejected), and rebuilds the layout. See [src/features/catalog/model/sceneShare.ts](src/features/catalog/model/sceneShare.ts).

##  AI usage

Parts of this project (documentation, refactors, boilerplate) were assisted by AI tooling. All 3D interaction logic, architecture decisions and asset curation were reviewed and validated by a human.

##  Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow, coding conventions and branch strategy, and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

##  Credits & asset attribution

The **source code** is MIT-licensed. The **3D models and textures** under `public/` are third-party assets and remain the property of their respective authors, each under its own license. Please verify individual licenses before reusing them commercially.

3D models come from creators including **Poly by Google**, **Quaternius**, **CreativeTrio**, **FUS3N**, **Jarlan Perez**, **jeff cobesign** and others (author names are preserved in the model filenames). If you are an author and want an attribution updated or an asset removed, please open an issue.

##  License

Released under the [MIT License](LICENSE) © massdx.
