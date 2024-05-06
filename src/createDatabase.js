const sqlite3 = require('sqlite3').verbose();

// Initialize the database connection
const db = new sqlite3.Database('treningsdagbok.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Database connected!');
        initializeDatabase(); // Call a function to initialize tables if they don't exist
    }
});

// Function to initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT,
                description TEXT
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE NOT NULL,
                duration INTEGER,
                notes TEXT
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS sets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                workout_id INTEGER NOT NULL,
                exercise_id INTEGER NOT NULL,
                weight REAL,
                reps INTEGER,
                FOREIGN KEY (workout_id) REFERENCES workouts(id),
                FOREIGN KEY (exercise_id) REFERENCES exercises(id)
            );
        `);
    });
}
