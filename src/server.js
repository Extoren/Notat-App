const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

class Database {
    constructor() {
        this.db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Database connected!');
                this.initialize();
            }
        });
    }

    initialize() {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )`);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userId INTEGER,
                    title TEXT,
                    content TEXT,
                    tags TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modifiedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (userId) REFERENCES users(id)
                )`);
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

const db = new Database();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (user && bcrypt.compareSync(password, user.password)) {
            res.json({ message: "Login successful", userId: user.id });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
        const userId = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const { userId } = req.query;
        const notes = await db.all('SELECT * FROM notes WHERE userId = ?', [userId]);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/notes', async (req, res) => {
    const { title, content, tags, userId } = req.body;
    try {
        const noteId = await db.run('INSERT INTO notes (userId, title, content, tags) VALUES (?, ?, ?, ?)', [userId, title, content, tags]);
        res.status(201).json({ message: "Note created successfully", id: noteId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.run('DELETE FROM notes WHERE id = ?', [id]);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});

app.get('/searchNotes', async (req, res) => {
    const { tags, userId } = req.query;
    try {
        const tagsList = tags.split(',').map(tag => `%${tag}%`);
        const notes = await db.all(`SELECT * FROM notes WHERE userId = ? AND tags LIKE ?`, [userId, ...tagsList]);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/exportNotes', async (req, res) => {
    const { userId } = req.query;
    try {
        const notes = await db.all('SELECT * FROM notes WHERE userId = ?', [userId]);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/importNotes', async (req, res) => {
    const { notes, userId } = req.body;
    try {
        for (const note of notes) {
            await db.run('INSERT INTO notes (userId, title, content, tags) VALUES (?, ?, ?, ?)', [userId, note.title, note.content, note.tags]);
        }
        res.status(201).json({ message: "Notes imported successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
