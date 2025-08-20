const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
document.getElementById('matrix').appendChild(canvas);

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const columns = Math.floor(width / 20);
const drops = new Array(columns).fill(1);

context.fillStyle = 'rgba(152, 255, 152, 0.1)';
context.font = '15px monospace';

const words = ['plasma', 'gtrillions']; 

const sosAudio = new Audio('sos_morse.mp3');

let wordPositions = [];

function draw() {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#019394';
    for (let i = 0; i < drops.length; i++) {
        let text;
        if (Math.random() < 0.25 && wordPositions.findIndex(wp => wp.col === i) === -1) { // 25% chance to start a word
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

// Add terminal functionality
if (document.querySelector('.terminal-window')) {
    const terminalOutput = document.getElementById('terminal-output');
    const inputArea = document.querySelector('.input-area');
    const commandHistory = [];
    let historyIndex = -1;

    // Add initial message
    const initialMessage = document.createElement('div');
    initialMessage.innerHTML = "Plasma PowerShell\n(C) Plasma Corporation. All rights reserved.\nType 'help' for available commands.";
    initialMessage.style.whiteSpace = 'pre-line';
    terminalOutput.appendChild(initialMessage);

    function executeCommand(command) {
        const output = document.createElement('div');
        output.textContent = `$> ${command}`;
        terminalOutput.appendChild(output);

        if (command === '...---...' || command === '... --- ...') {
            sosAudio.play();
            const response = document.createElement('div');
            response.textContent = 'Playing SOS Morse code message...';
            terminalOutput.appendChild(response);
            return;
        }

        if (command === 'plasma') {
            window.open('https://docs.plasma.to/docs/get-started/introduction/start-here', '_blank');
            return;
        }

        if (command === 'clear') {
            terminalOutput.innerHTML = '';
            // Re-add the initial message
            const initialMessage = document.createElement('div');
            initialMessage.innerHTML = "Plasma PowerShell\n(C) Plasma Corporation. All rights reserved.\nType 'help' for available commands.";
            initialMessage.style.whiteSpace = 'pre-line';
            terminalOutput.appendChild(initialMessage);
            return;
        }

        if (command === 'help') {
            const helpMessage = document.createElement('div');
            helpMessage.innerHTML = "Available commands:\n1. plasma\n2. clear (clear the screen)\n3. help (show this help)\n4. submit (submit telegram username and secret key)";
            helpMessage.style.whiteSpace = 'pre-line';
            terminalOutput.appendChild(helpMessage);
            return;
        }

        if (command === 'submit') {
            const submitHelp = document.createElement('div');
            submitHelp.textContent = "submit --tg telegram_username --secret secret";
            terminalOutput.appendChild(submitHelp);
            return;
        }

        const response = document.createElement('div');
        response.textContent = `Command '${command}' executed`;
        terminalOutput.appendChild(response);

        commandHistory.push(command);
        historyIndex = commandHistory.length;
    }

    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = inputArea.value.trim();
            if (command) {
                executeCommand(command);
                inputArea.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputArea.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                inputArea.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                inputArea.value = '';
            }
        }
    });

    inputArea.focus();
}
