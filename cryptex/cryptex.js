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
        if (Math.random() < 0.25 && wordPositions.findIndex(wp => wp.col === i) === -1) { // 20% chance to start a word
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

// Cryptex functionality
const targetWord = "KOZHNZYUG";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let currentPositions = [];

function initializeCryptex() {
    const ringsContainer = document.getElementById('cryptex-rings');
    ringsContainer.innerHTML = '';
    
    for (let i = 0; i < targetWord.length; i++) {
        currentPositions[i] = Math.floor(Math.random() * 26);
        
        const ringContainer = document.createElement('div');
        ringContainer.className = 'ring-container';
        ringContainer.innerHTML = `
            <button class="ring-btn" onclick="rotateRing(${i}, 1)">▲</button>
            <div class="ring" onclick="rotateRing(${i}, 1)">
                <div class="ring-letter" id="letter-${i}">${alphabet[currentPositions[i]]}</div>
            </div>
            <button class="ring-btn" onclick="rotateRing(${i}, -1)">▼</button>
        `;
        
        ringsContainer.appendChild(ringContainer);
    }
}

function rotateRing(ringIndex, direction) {
    currentPositions[ringIndex] = (currentPositions[ringIndex] + direction + 26) % 26;
    document.getElementById(`letter-${ringIndex}`).textContent = alphabet[currentPositions[ringIndex]];
}

function getCurrentWord() {
    return currentPositions.map(pos => alphabet[pos]).join('');
}

function checkSolution() {
    const currentWord = getCurrentWord();
    const resultDiv = document.getElementById('result');
    
    if (currentWord === targetWord) {
        resultDiv.innerHTML = `
            <div class="success">
                🎉 CRYPTEX UNLOCKED! 🎉<br>
                The secret word is: <strong>${targetWord}</strong><br>
                Congratulations, you've solved the ancient puzzle!
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="error">
                ❌ Wrong combination: ${currentWord}<br>
                Keep trying to find the correct word...
            </div>
        `;
        
        // Clear error message after 3 seconds
        setTimeout(() => {
            resultDiv.innerHTML = '';
        }, 3000);
    }
}

// Add click event to rings for easier interaction
document.addEventListener('DOMContentLoaded', function() {
    initializeCryptex();
    
    // Make rings clickable to rotate
    document.addEventListener('click', function(e) {
        if (e.target.closest('.ring') && !e.target.closest('.ring-btn')) {
            const ringContainer = e.target.closest('.ring-container');
            const ringIndex = Array.from(ringContainer.parentNode.children).indexOf(ringContainer);
            rotateRing(ringIndex, 1);
        }
    });
});

// Add keyboard controls
document.addEventListener('keydown', function(e) {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const index = numbers.indexOf(e.key);
    
    if (index !== -1 && index < targetWord.length) {
        if (e.shiftKey) {
            rotateRing(index, -1); // Shift + number = rotate down
        } else {
            rotateRing(index, 1); // Number = rotate up
        }
    }
    
    if (e.key === 'Enter' || e.key === ' ') {
        checkSolution();
    }
});
