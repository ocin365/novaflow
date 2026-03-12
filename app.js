const { createApp } = Vue;

createApp({
    data() {
        return {
            notes: [],
            newNoteTitle: '',
            currentNote: '',
            selectedIndex: null, // Track which note we are editing
            timerSeconds: 1500,
            timerRunning: false,
            timerInterval: null
        }
    },
    computed: {
        formatTime() {
            const mins = Math.floor(this.timerSeconds / 60);
            const secs = this.timerSeconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    },
    mounted() {
        const savedNotes = localStorage.getItem('novaNotes');
        if (savedNotes) this.notes = JSON.parse(savedNotes);
    },
    methods: {
        // Now handles both Creating AND Updating
        addNote() {
            const noteData = {
                title: this.newNoteTitle || 'Untitled Idea',
                content: this.currentNote,
                date: new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };

            if (this.selectedIndex !== null) {
                // Update existing note
                this.notes[this.selectedIndex] = noteData;
                this.selectedIndex = null;
            } else {
                // Add new note to the top
                this.notes.unshift(noteData);
            }

            this.saveNotes();
            this.clearEditor();
        },
        
        loadNote(index) {
            this.selectedIndex = index;
            this.newNoteTitle = this.notes[index].title;
            this.currentNote = this.notes[index].content;
        },

        deleteNote(index) {
            if(confirm("Delete this idea?")) {
                this.notes.splice(index, 1);
                this.saveNotes();
                this.clearEditor();
            }
        },

        clearEditor() {
            this.newNoteTitle = '';
            this.currentNote = '';
            this.selectedIndex = null;
        },

        saveNotes() {
            localStorage.setItem('novaNotes', JSON.stringify(this.notes));
        },

        // Timer Logic
        toggleTimer() {
            if (this.timerRunning) {
                clearInterval(this.timerInterval);
            } else {
                this.timerInterval = setInterval(() => {
                    if (this.timerSeconds > 0) {
                        this.timerSeconds--;
                    } else {
                        alert("Flow Session Complete!");
                        this.resetTimer();
                    }
                }, 1000);
            }
            this.timerRunning = !this.timerRunning;
        },

        resetTimer() {
            clearInterval(this.timerInterval);
            this.timerRunning = false;
            this.timerSeconds = 1500;
        }
    }
}).mount('#app');
