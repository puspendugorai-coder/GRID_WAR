<div align="center">

# ⚡ GRID WAR
### Tactical Tic Tac Toe — Multi-Player Edition

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*A neon arcade-themed, fully animated Tic Tac Toe game supporting 2–6 players with dynamic grid sizes, confetti explosions, sound effects, and a glitch aesthetic.*

### 🚀 Live Demo

## 👉 [Click Here to Play](https://tic-tac-toe-9qy9.onrender.com)

---
</div>

---

## 🎮 Features

| Feature | Description |
|---|---|
| 👥 **2–6 Players** | Supports 2 to 6 players in one session |
| 🏷️ **Custom Names** | Each player enters their own name |
| 🔣 **Unique Symbols** | `X` `O` `△` `□` `★` `◆` — each with a distinct neon color |
| 📐 **Dynamic Grid** | Grid scales with player count: 3×3 → 5×5 → 6×6 |
| 🏆 **Win Animations** | Glowing winning cells + trophy modal + confetti burst |
| 🤝 **Draw Detection** | Separate draw screen when board fills with no winner |
| 🔁 **Restart Button** | Same players & scores, fresh board |
| ⊞ **Next Game Button** | Fully resets — back to player count selection |
| ← **Back Button** | Present on every page and every setup step |
| 📊 **Score Tracker** | Scores persist across rematches in the same session |
| 👁️ **Hover Preview** | Ghost symbol appears in cells before you click |
| 🔊 **Sound Effects** | Web Audio tones on placement + victory fanfare |
| 🌌 **Animated BG** | Scrolling neon grid + floating particle system |
| ✨ **Glitch Logo** | CSS RGB-split glitch text animation |
| 📱 **Responsive** | Works on both mobile and desktop |

---

## 📁 File Structure

```
tictactoe/
│
├── app.py                  # Flask backend — routes, game logic, session state
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (secret key, port) — NOT committed
├── .gitignore              # Ignores __pycache__, .env, venv, etc.
│
├── templates/
│   ├── index.html          # Setup page (Step 1: player count, Step 2: names)
│   └── game.html           # Game board, score panel, win/draw overlays
│
└── static/
    ├── css/
    │   └── style.css       # Full neon-arcade theme, all animations & transitions
    └── js/
        ├── particles.js    # Canvas-based floating neon particle background
        ├── setup.js        # Setup page — step navigation & name field builder
        └── game.js         # Move handling, win/draw detection, confetti, sounds
```

---

## 🚀 Getting Started

## 🕹️ How to Play

```
1. Choose how many players (2–6)
        ↓
2. Enter each player's name
        ↓
3. Click cells to place your symbol
        ↓
4. First to complete a full row, column, or diagonal WINS!
        ↓
5. Rematch (same players) or start a brand new game
```

### Grid Size by Player Count

| Players | Grid |
|:---:|:---:|
| 2 | 3 × 3 |
| 3 – 4 | 5 × 5 |
| 5 – 6 | 6 × 6 |

---

## 🛠️ Tech Stack

- **Backend** — Python 3.8+, Flask 3.0, server-side session management
- **Frontend** — Vanilla HTML5, CSS3 (custom properties, keyframe animations), JavaScript (ES6+)
- **Audio** — Web Audio API (no external libraries)
- **Fonts** — Google Fonts: *Orbitron* (display) + *Share Tech Mono* (body)
- **Graphics** — Pure CSS glitch effects, Canvas 2D particle system

---

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ⚡ and too much neon

</div>
