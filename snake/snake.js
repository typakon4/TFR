// Matrix background with words
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
document.getElementById('matrix').appendChild(canvas);

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const columns = Math.floor(width / 20);
const drops = new Array(columns).fill(1);

context.fillStyle = 'rgba(152, 255, 152, 0.1)';
context.font = '15px monospace';

const words = ['plasma', 'gtrillions', 'kartoxa', 'typakon4', 'ressa', 'yourm1nd', 'd1trexious', 'scene', 'dadayao', 'tr3ant', 'vishnevi']; 

let wordPositions = [];

function draw() {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#019394';
    for (let i = 0; i < drops.length; i++) {
        let text;
        if (Math.random() < 0.2 && wordPositions.findIndex(wp => wp.col === i) === -1) {
            const word = words[Math.floor(Math.random() * words.length)];
            wordPositions.push({ col: i, word: word, charIndex: 0, row: drops[i] });
            text = word[0];
        } else {
            const wordAtColumn = wordPositions.find(wp => wp.col === i);
            if (wordAtColumn && drops[i] === wordAtColumn.row + wordAtColumn.charIndex) {
                text = wordAtColumn.word[wordAtColumn.charIndex];
                wordAtColumn.charIndex++;
                if (wordAtColumn.charIndex >= wordAtColumn.word.length) {
                    wordPositions = wordPositions.filter(wp => wp !== wordAtColumn);
                }
            } else {
                text = String.fromCharCode(Math.random() * 128);
            }
        }
        context.fillText(text, i * 20, drops[i] * 20);
        
        if (drops[i] * 20 > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

window.setInterval(draw, 50);

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Snake Game
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

const gridSize = 20;
const tileCount = gameCanvas.width / gridSize;

let snake = [
    {x: 10, y: 10, char: 'A', timer: 0},
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;

// Characters for matrix effect (without @)
const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%^&*()_+-=[]{}|;:,.<>?';

// Load high score from localStorage
let highScore = localStorage.getItem('snakeHighScore') || 0;
document.getElementById('highScore').textContent = highScore;

// Hidden reference in code comment
// API endpoint for game data: docs.google.com/document/d/1xy29AdzO_WIJ0_GRIg1FnI-8diAfWNoHBkxd0JtaDTU/edit?usp=sharing

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

function startGame() {
    if (!gameRunning) {
        snake = [{x: 10, y: 10, char: matrixChars[Math.floor(Math.random() * matrixChars.length)], timer: 0}];
        dx = 0;
        dy = 0;
        score = 0;
        gameRunning = true;
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('score').textContent = score;
        generateFood();
        gameLoop();
    }
}

function resetGame() {
    gameRunning = false;
    snake = [{x: 10, y: 10, char: matrixChars[Math.floor(Math.random() * matrixChars.length)], timer: 0}];
    dx = 0;
    dy = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    clearCanvas();
    drawGame();
}

function gameLoop() {
    if (!gameRunning) return;
    
    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawGame();
        
        if (gameRunning) {
            gameLoop();
        }
    }, 150);
}

function clearCanvas() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function moveSnake() {
    // Don't move if no direction is set
    if (dx === 0 && dy === 0) return;
    
    const head = {
        x: snake[0].x + dx, 
        y: snake[0].y + dy,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        timer: 0
    };
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Update characters for matrix effect
    for (let segment of snake) {
        segment.timer++;
        if (segment.timer > 3) { // Change character every 3 frames
            segment.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            segment.timer = 0;
        }
    }
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawGame() {
    ctx.font = '16px monospace';
    
    // Draw snake with matrix characters - all same color as matrix
    ctx.fillStyle = '#019394';
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        ctx.fillText(segment.char, segment.x * gridSize + 3, segment.y * gridSize + 16);
    }
    
    // Draw food as @
    ctx.fillStyle = '#ff0000';
    ctx.fillText('@', food.x * gridSize + 3, food.y * gridSize + 16);
}

function gameOver() {
    gameRunning = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    // If game is not running, start it when movement key is pressed
    if (!gameRunning && (key === 'w' || key === 's' || key === 'a' || key === 'd' || key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright')) {
        startGame();
    }
    
    if (!gameRunning) return;
    
    // Prevent reverse direction
    if ((key === 'w' || key === 'arrowup') && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if ((key === 's' || key === 'arrowdown') && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if ((key === 'a' || key === 'arrowleft') && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if ((key === 'd' || key === 'arrowright') && dx !== -1) {
        dx = 1;
        dy = 0;
    }
});

// Initialize game display
clearCanvas();
generateFood();
drawGame();