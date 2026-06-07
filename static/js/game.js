/* game.js */
let currentPlayer = CURRENT;
let gameOver = GAME_OVER;
let board = BOARD.slice();
let players = JSON.parse(JSON.stringify(PLAYERS));

const boardEl = document.getElementById('board');
const turnBanner = document.getElementById('turnBanner');
const scoreboard = document.getElementById('scoreboard');
const winOverlay = document.getElementById('winOverlay');
const drawOverlay = document.getElementById('drawOverlay');
const winName = document.getElementById('winName');
const winEmoji = document.getElementById('winEmoji');
const confettiContainer = document.getElementById('confettiContainer');

// If game was already over when page loaded
if (GAME_OVER) {
    if (WINNER === 'draw') {
        showDraw();
    } else if (WINNER) {
        applyWinningCells(WIN_LINE);
        showWin(WINNER);
    }
}

// Attach click listeners to cells
document.querySelectorAll('.cell').forEach(cell => {
    if (!cell.disabled) {
        cell.addEventListener('click', () => handleMove(parseInt(cell.dataset.index)));
    }
});

async function handleMove(idx) {
    if (gameOver) return;
    const cell = document.getElementById(`cell-${idx}`);
    if (!cell || cell.disabled || board[idx]) return;

    // Optimistic UI: disable cell immediately
    cell.disabled = true;

    try {
        const res = await fetch('/move', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index: idx })
        });
        const data = await res.json();
        if (data.error) { cell.disabled = false; return; }

        // Update local state
        board = data.board;
        players = data.players;
        currentPlayer = data.current;
        gameOver = data.game_over;

        // Render symbol
        const p = players.find(p => p.symbol === board[idx]);
        if (p) {
            cell.innerHTML = `<span class="cell-symbol" style="color:${p.color};text-shadow:0 0 12px ${p.color},0 0 30px ${p.color}66">${p.symbol}</span>`;
            cell.classList.add('filled');
            cell.style.setProperty('--sym-color', p.color);
            cell.disabled = true;
            playPlaceSound();
        }

        if (data.game_over) {
            if (data.winner === 'draw') {
                setTimeout(showDraw, 400);
            } else {
                applyWinningCells(data.winning_line, p ? p.color : null);
                setTimeout(() => showWin(data.winner), 700);
            }
        } else {
            updateTurnBanner();
            updateScoreboard();
        }
    } catch (e) {
        cell.disabled = false;
        console.error(e);
    }
}

function applyWinningCells(line, color) {
    line.forEach((idx, i) => {
        const cell = document.getElementById(`cell-${idx}`);
        if (cell) {
            setTimeout(() => {
                cell.classList.add('winning');
                if (color) cell.style.setProperty('--sym-color', color);
            }, i * 80);
        }
    });
}

function updateTurnBanner() {
    const p = players[currentPlayer];
    if (!p) return;
    turnBanner.innerHTML = `
    <span class="turn-sym" style="color:${p.color};text-shadow:0 0 10px ${p.color}">${p.symbol}</span>
    <span class="turn-txt">${p.name}'s TURN</span>
  `;
}

function updateScoreboard() {
    document.querySelectorAll('.score-card').forEach((card, i) => {
        card.classList.toggle('active', i === currentPlayer && !gameOver);
        const valEl = card.querySelector('.score-val');
        if (valEl) valEl.textContent = players[i].score;
    });
}

function showWin(winner) {
    winName.textContent = winner.name;
    winName.style.color = winner.color;
    winName.style.textShadow = `0 0 15px ${winner.color}`;
    winEmoji.textContent = getWinEmoji(players.indexOf(winner));
    winOverlay.classList.remove('hidden');
    launchConfetti(winner.color);
    playWinSound();
}

function showDraw() {
    drawOverlay.classList.remove('hidden');
}

function getWinEmoji(idx) {
    return ['🏆', '👑', '⚡', '🔥', '💎', '🌟'][idx] || '🏆';
}

/* ── Confetti ── */
const CONFETTI_COLORS = ['#00f5ff', '#ff2d78', '#39ff14', '#ffd700', '#bf00ff', '#ff6600', '#ffffff'];

function launchConfetti(baseColor) {
    confettiContainer.innerHTML = '';
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'confetti-piece';
            const colors = [baseColor, ...CONFETTI_COLORS];
            p.style.cssText = `
        left: ${Math.random()*100}%;
        top: ${Math.random()*20 - 10}%;
        background: ${colors[Math.floor(Math.random()*colors.length)]};
        width: ${Math.random()*10+4}px;
        height: ${Math.random()*10+4}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${Math.random()*1.5+1}s;
        animation-delay: ${Math.random()*0.5}s;
      `;
            confettiContainer.appendChild(p);
        }, i * 30);
    }
}

/* ── Sound Effects (Web Audio) ── */
let audioCtx;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playTone(freq, type, dur, vol = 0.15) {
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.start();
        osc.stop(ctx.currentTime + dur);
    } catch (e) {}
}

function playPlaceSound() {
    playTone(440 + currentPlayer * 80, 'sine', 0.12, 0.1);
}

function playWinSound() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => setTimeout(() => playTone(n, 'sine', 0.3, 0.12), i * 120));
}

/* ── Cell hover preview ── */
boardEl.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        if (cell.disabled || cell.classList.contains('filled') || gameOver) return;
        const p = players[currentPlayer];
        if (p) {
            cell.innerHTML = `<span style="color:${p.color};opacity:0.3;font-size:inherit">${p.symbol}</span>`;
        }
    });
    cell.addEventListener('mouseleave', () => {
        if (cell.disabled || cell.classList.contains('filled') || gameOver) return;
        cell.innerHTML = '';
    });
});