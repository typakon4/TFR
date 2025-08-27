class Board {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('boardNotes')) || [];
        this.paperTypes = ['paper1.jpg', 'paper2.jpg', 'paper3.jpg'];
        this.init();
    }

    init() {
        this.renderNotes();
        this.setupEventListeners();
        // Добавляем начальные записки если их нет
        if (this.notes.length === 0) {
            this.addInitialNotes();
        }
    }

    addInitialNotes() {
        const initialNotes = [
            { text: "PLASMA INVESTIGATION", x: 15, y: 20 },
            { text: "Key witnesses:\n- gtrillions\n- kartoxa", x: 65, y: 15 },
            { text: "Check blockchain\ntransactions", x: 25, y: 65 },
            { text: "Meeting location:\nTBD", x: 70, y: 70 }
        ];

        initialNotes.forEach(note => {
            this.addNoteAtPosition(note.text, note.x, note.y);
        });
    }

    addNoteAtPosition(text, x, y) {
        const note = {
            id: Date.now() + Math.random(),
            text: text,
            x: x,
            y: y,
            rotation: Math.random() * 10 - 5,
            paperType: this.paperTypes[Math.floor(Math.random() * this.paperTypes.length)]
        };

        this.notes.push(note);
        this.saveNotes();
        this.renderNotes();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('add-note-btn');
        const backBtn = document.getElementById('back-btn');
        const modal = document.getElementById('note-modal');
        const closeBtn = document.querySelector('.close');
        const saveBtn = document.getElementById('save-note-btn');
        const noteText = document.getElementById('note-text');

        addBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            noteText.focus();
        });

        backBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            noteText.value = '';
        });

        saveBtn.addEventListener('click', () => {
            const text = noteText.value.trim();
            if (text) {
                this.addNote(text);
                modal.style.display = 'none';
                noteText.value = '';
            }
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                noteText.value = '';
            }
        });

        // Enter to save note
        noteText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                const text = noteText.value.trim();
                if (text) {
                    this.addNote(text);
                    modal.style.display = 'none';
                    noteText.value = '';
                }
            }
        });
    }

    addNote(text) {
        const note = {
            id: Date.now(),
            text: text,
            x: Math.random() * 60 + 15,
            y: Math.random() * 50 + 20,
            rotation: Math.random() * 15 - 7,
            paperType: this.paperTypes[Math.floor(Math.random() * this.paperTypes.length)]
        };

        this.notes.push(note);
        this.saveNotes();
        this.renderNotes();
    }

    removeNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        this.saveNotes();
        this.renderNotes();
    }

    renderNotes() {
        const container = document.querySelector('.paper-notes');
        container.innerHTML = '';

        this.notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'paper-note';
            noteElement.style.left = note.x + '%';
            noteElement.style.top = note.y + '%';
            noteElement.style.transform = `rotate(${note.rotation}deg)`;
            noteElement.style.backgroundImage = `url('images/${note.paperType || 'paper1.jpg'}')`;

            const textElement = document.createElement('div');
            textElement.className = 'note-text';
            textElement.textContent = note.text;

            noteElement.appendChild(textElement);

            // Double click to remove note
            noteElement.addEventListener('dblclick', (e) => {
                e.preventDefault();
                if (confirm('Remove this note?')) {
                    this.removeNote(note.id);
                }
            });

            container.appendChild(noteElement);
        });
    }

    saveNotes() {
        localStorage.setItem('boardNotes', JSON.stringify(this.notes));
    }
}

// Initialize board when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Board();
});
