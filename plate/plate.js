// Matrix background effect (same as main page)
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '1';
canvas.style.pointerEvents = 'none';
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
    const newColumns = Math.floor(width / 20);
    if (newColumns !== columns) {
        drops.length = newColumns;
        for (let i = columns; i < newColumns; i++) {
            drops[i] = 1;
        }
    }
});

// Audio player functionality
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.querySelector('.progress-bar');
const vinylRecord = document.querySelector('.vinyl-record');
const vinylArm = document.querySelector('.vinyl-arm');

// Auto-start music when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        audio.play().then(() => {
            startPlaying();
        }).catch(e => {
            console.log('Auto-play prevented:', e);
        });
    }, 1000);
});

function startPlaying() {
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    vinylRecord.classList.add('spinning');
    vinylArm.classList.add('playing');
}

function stopPlaying() {
    playBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    vinylRecord.classList.remove('spinning');
    vinylArm.classList.remove('playing');
}

playBtn.addEventListener('click', () => {
    audio.play();
    startPlaying();
});

pauseBtn.addEventListener('click', () => {
    audio.pause();
    stopPlaying();
});

// Progress bar functionality
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    stopPlaying();
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
});

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
