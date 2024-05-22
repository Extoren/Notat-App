# Notat-App

Description: Notat-App is a web-based application designed for note-taking, which allows users to manage personal notes with features such as user authentication, CRUD operations on notes, and import/export functionalities.

### Read Testplan [Testplan.docx]
### Read Report [Rapport.docx]


#
Installation:

Prerequisites:

-   Node.js: Required to run the backend and frontend
-   npm (Node Package Manager): Used to install dependencies

Check Node.js installation:

`node --version`

Check npm installation:

`npm --version`

Dependencies: Install all necessary dependencies by running:

`npm install`

This command installs packages like:

-   express: For the server framework
-   body-parser: For parsing incoming request bodies
-   cors: For enabling CORS (Cross-Origin Resource Sharing)
-   sqlite3: For the SQLite database functionality
-   bcryptjs: For hashing and comparing passwords

Database Setup: The application uses SQLite for storing data. The database is set up automatically when the server runs:

`// Database setup in server.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', ...);`

Running the Server: Start the server by running:

`node server.js`

The server will listen on port 3001 by default. Adjust the port by modifying the PORT environment variable if necessary.

Running the React Application:

Navigate to the project directory and start the React application:

`npm start`

This command runs the app in development mode. Visit [http://localhost:3000](http://localhost:3000/) to view it in your browser. The page will automatically reload if you make edits.

If this error shows:

`Error: error:0308010C:digital envelope routines::unsupported`

Run:
```
$env:NODE_OPTIONS="--openssl-legacy-provider"
```

Usage:

Features:

-   User Authentication: Users can register, login, and logout.
-   CRUD Operations: Users can create, read, update, and delete notes.
-   Search: Users can search for notes by tags.
-   Import/Export: Users can import and export notes in JSON format.
