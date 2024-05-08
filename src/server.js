const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(bodyParser.json());

// Connect to the database and create tables if they don't exist
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
      console.error('Error opening database', err.message);
  } else {
      console.log('Database connected!');
      db.run(`
          CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL
          )`, (err) => {
              if (err) console.error("Error creating users table", err.message);
          });
      db.run(`
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
});

// Register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ id: this.lastID, username });
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (user && bcrypt.compareSync(password, user.password)) {
          res.json({ message: "Login successful", userId: user.id });
      } else {
          res.status(400).json({ error: "Invalid credentials" });
      }
  });
});

// When creating a new note
app.post('/notes', (req, res) => {
  const { userId, title, content, tags } = req.body;
  const createdAt = new Date().toISOString();
  const modifiedAt = createdAt;
  db.run('INSERT INTO notes (userId, title, content, tags, createdAt, modifiedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, content, tags, createdAt, modifiedAt], function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({ id: this.lastID });
  });
});

// When updating an existing note
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  const modifiedAt = new Date().toISOString();
  db.run('UPDATE notes SET title = ?, content = ?, tags = ?, modifiedAt = ? WHERE id = ?',
      [title, content, tags, modifiedAt, id], function (err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (this.changes > 0) {
          res.json({ message: 'Updated successfully' });
      } else {
          res.status(404).json({ error: 'Note not found' });
      }
  });
});

// Get all notes for a specific user
app.get('/notes', (req, res) => {
  const { userId } = req.query; 
  db.all('SELECT * FROM notes WHERE userId = ?', [userId], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(rows);
  });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM notes WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes > 0) {
      res.json({ message: 'Deleted successfully' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

