# Rabbit Run — Blockly

A mini-game for learning programming with **Blockly**. The player controls a rabbit, collects carrots, and completes levels by building programs from visual blocks or controlling the rabbit with the keyboard.

**👉 [Play on GitHub Pages](https://andreipabiarzhyn.github.io/funtech-blockly-m2l4-control/)**

---

## About the project

An interactive educational web game for kids and beginners. It consists of **10 levels** of increasing difficulty:

- **Levels 1–4** — `program` mode: build a sequence of commands with loops.
- **Levels 5–7** — `keyboard` mode: keyboard control via arrow key handlers and collision events.
- **Levels 8–10** — `keyboard` mode with moving viruses: collect all carrots, reach the exit, and avoid enemies.

Great for block-based programming lessons, introducing algorithms, loops, and event handling.

---

## Game mechanics

- **Rabbit** — the player character.
- **Carrots** — collectible items (must collect all on the level).
- **Exit** — the finish point, must reach it to win.
- **Walls** — obstacles, cannot be passed through.
- **Viruses** — moving enemies; colliding with them results in a loss.
- **Robot friend** — appears on the last level; you can set a happy emotion on it.

## Blocks

| Block | Purpose |
|-------|---------|
| `when_run` | Program entry point (always at the start) |
| `move_up/down/left/right` | Step in the specified direction |
| `repeat_times` | Loop (repeat N times) |
| `take_carrot` | Take a carrot |
| `set_emotion` | Show an emotion (happy/sad) |
| `set_bg` | Change background color |
| `key_left/right/up/down` | Arrow key press handler |
| `on_collision` | Collision handler (virus, friend, carrot) |
| `stop_game` | End the game (win/lose) |

---

## Tech stack

- **Languages:** JavaScript, CSS, HTML
- **Visual editor:** Blockly (v10)
- **Build:** No bundler, pure browser JS
- **Deployment:** GitHub Pages

---

## Project structure

```
├── index.html        — main page
├── style.css         — styles
├── app.js            — game logic
├── blocks.js         — Blockly block definitions
├── tasks.js          — all 10 level configurations
├── i18n.js           — translations (RU/EN/PL)
├── libs/
│   └── blockly.min.js — Blockly library
├── img/              — sprites and icons
└── sounds/           — sound effects
```

---

## How to run locally

Open `index.html` in any modern browser — no server, no build step needed.

Or use Live Server in VS Code (e.g., [Ritwick Dey's Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)).

---

## Translations

Three languages are supported: **Russian**, **English**, **Polish**. Switch in the top-right corner. The language is saved in `localStorage`.

---

## Author

Developer: **Andrei Pabiarzhyn** · for **Kodland** · © 2025