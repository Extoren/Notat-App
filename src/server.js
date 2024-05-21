const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor() {
        this.db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database', err.message);
            } else {
                console.log('Database connected!');
                this.setup();
            }
        });
    }

    setup() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`, (err) => {
                if (err) console.error("Error creating users table", err.message);
            });
        this.db.run(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                title TEXT,
                content TEXT,
                tags TEXT,
                createdAt TEXT,
                modifiedAt TEXT,
                FOREIGN KEY (userId) REFERENCES users(id)
            )`, (err) => {
                if (err) console.error("Error creating notes table", err.message);
            });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

const bcrypt = require('bcryptjs');

class Auth {
    constructor(database) {
        this.db = database;
    }

    async register(username, password) {
        const hashedPassword = await bcrypt.hash(password, 8);
        return this.db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    }

    async login(username, password) {
        try {
            const user = await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
            if (user && bcrypt.compareSync(password, user.password)) {
                return { message: "Login successful", userId: user.id };
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (err) {
            throw err;
        }
    }
}


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new Database();
const auth = new Auth(db);

// Register endpoint using Auth class
app.post('/register', async (req, res) => {
    try {
        const result = await auth.register(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login endpoint using Auth class
app.post('/login', async (req, res) => {
    try {
        const result = await auth.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Additional endpoints would similarly use methods from the Database class

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
