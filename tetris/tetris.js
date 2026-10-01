const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

const COLORS = [null, '#00f0f0', '#f0f000', '#a000f0', '#00f000', '#f00000', '#0000f0', '#f0a000'];

// Index matches COLORS: I, O, T, S, Z, J, L
const SHAPES = [
    null,
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[2, 2], [2, 2]],
    [[0, 3, 0], [3, 3, 3], [0, 0, 0]],
    [[0, 4, 4], [4, 4, 0], [0, 0, 0]],
    [[5, 5, 0], [0, 5, 5], [0, 0, 0]],
    [[6, 0, 0], [6, 6, 6], [0, 0, 0]],
    [[0, 0, 7], [7, 7, 7], [0, 0, 0]],
];

const LINE_POINTS = [0, 100, 300, 500, 800];

const boardCanvas = document.getElementById('board');
const ctx = boardCanvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas.getContext('2d');
const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');
const startBtn = document.getElementById('start');

let board, piece, nextPiece, bag;
let score, lines, level;
let dropInterval, dropCounter, lastTime;
let running = false;
let paused = false;
let animationId = null;

function createBoard() {
    return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

// 7-bag randomizer: every piece appears once per 7 draws
function drawFromBag() {
    if (!bag || bag.length === 0) {
        bag = [1, 2, 3, 4, 5, 6, 7];
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
    }
    const type = bag.pop();
    const matrix = SHAPES[type].map(row => row.slice());
    return { matrix, x: Math.floor((COLS - matrix[0].length) / 2), y: 0 };
}

function collides(matrix, x, y) {
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (!matrix[r][c]) continue;
            const nx = x + c;
            const ny = y + r;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
            if (ny >= 0 && board[ny][nx]) return true;
        }
    }
    return false;
}

function rotate(matrix) {
    return matrix[0].map((_, c) => matrix.map(row => row[c]).reverse());
}

function merge() {
    piece.matrix.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value && piece.y + r >= 0) board[piece.y + r][piece.x + c] = value;
        });
    });
}

function clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(v => v)) {
            board.splice(r, 1);
            board.unshift(new Array(COLS).fill(0));
            cleared++;
            r++;
        }
    }
    if (cleared) {
        score += LINE_POINTS[cleared] * level;
        lines += cleared;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 90);
        updateStats();
    }
}

function spawn() {
    piece = nextPiece;
    nextPiece = drawFromBag();
    if (collides(piece.matrix, piece.x, piece.y)) gameOver();
}

function lockPiece() {
    merge();
    clearLines();
    spawn();
}

function move(dx) {
    if (!collides(piece.matrix, piece.x + dx, piece.y)) piece.x += dx;
}

function softDrop() {
    if (!collides(piece.matrix, piece.x, piece.y + 1)) {
        piece.y++;
        score += 1;
        updateStats();
    } else {
        lockPiece();
    }
    dropCounter = 0;
}

function hardDrop() {
    while (!collides(piece.matrix, piece.x, piece.y + 1)) {
        piece.y++;
        score += 2;
    }
    updateStats();
    lockPiece();
    dropCounter = 0;
}

function rotatePiece() {
    const rotated = rotate(piece.matrix);
    // Simple wall kicks: try shifting left/right if the rotation collides
    for (const kick of [0, -1, 1, -2, 2]) {
        if (!collides(rotated, piece.x + kick, piece.y)) {
            piece.matrix = rotated;
            piece.x += kick;
            return;
        }
    }
}

function ghostY() {
    let y = piece.y;
    while (!collides(piece.matrix, piece.x, y + 1)) y++;
    return y;
}

function drawBlock(context, x, y, color, size) {
    context.fillStyle = color;
    context.fillRect(x * size, y * size, size, size);
    context.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    context.strokeRect(x * size + 0.5, y * size + 0.5, size - 1, size - 1);
}

function drawMatrix(context, matrix, ox, oy, size, alpha = 1) {
    context.globalAlpha = alpha;
    matrix.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value) drawBlock(context, ox + c, oy + r, COLORS[value], size);
        });
    });
    context.globalAlpha = 1;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
    drawMatrix(ctx, board, 0, 0, BLOCK);
    if (piece) {
        drawMatrix(ctx, piece.matrix, piece.x, ghostY(), BLOCK, 0.25);
        drawMatrix(ctx, piece.matrix, piece.x, piece.y, BLOCK);
    }

    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (nextPiece) {
        const size = 24;
        const m = nextPiece.matrix;
        const ox = (nextCanvas.width / size - m[0].length) / 2;
        const oy = (nextCanvas.height / size - m.length) / 2;
        drawMatrix(nextCtx, m, ox, oy, size);
    }

    if (paused || !running) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px system-ui, sans-serif';
        ctx.textAlign = 'center';
        const text = paused ? 'Paused' : (piece ? 'Game Over' : 'Press Start');
        ctx.fillText(text, boardCanvas.width / 2, boardCanvas.height / 2);
    }
}

function updateStats() {
    scoreEl.textContent = score;
    linesEl.textContent = lines;
    levelEl.textContent = level;
}

function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    if (!paused) {
        dropCounter += delta;
        if (dropCounter > dropInterval) {
            if (!collides(piece.matrix, piece.x, piece.y + 1)) {
                piece.y++;
            } else {
                lockPiece();
            }
            dropCounter = 0;
        }
    }
    draw();
    if (running) animationId = requestAnimationFrame(update);
}

function start() {
    board = createBoard();
    bag = [];
    score = 0;
    lines = 0;
    level = 1;
    dropInterval = 1000;
    dropCounter = 0;
    lastTime = performance.now();
    paused = false;
    running = true;
    nextPiece = drawFromBag();
    spawn();
    updateStats();
    startBtn.textContent = 'Restart';
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(update);
}

function gameOver() {
    running = false;
    startBtn.textContent = 'Play Again';
}

function handleAction(action) {
    if (!running) return;
    if (action === 'pause') {
        paused = !paused;
        return;
    }
    if (paused) return;
    switch (action) {
        case 'left': move(-1); break;
        case 'right': move(1); break;
        case 'down': softDrop(); break;
        case 'rotate': rotatePiece(); break;
        case 'drop': hardDrop(); break;
    }
    draw();
}

const KEY_ACTIONS = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowDown: 'down',
    ArrowUp: 'rotate',
    ' ': 'drop',
    p: 'pause',
    P: 'pause',
};

document.addEventListener('keydown', e => {
    const action = KEY_ACTIONS[e.key];
    if (!action) return;
    e.preventDefault();
    handleAction(action);
});

document.querySelectorAll('#touch button').forEach(btn => {
    btn.addEventListener('click', () => handleAction(btn.dataset.action));
});

startBtn.addEventListener('click', () => {
    start();
    startBtn.blur();
});

board = createBoard();
draw();
