# Note-Taking Application

This project is a full-stack note-taking application built with React for the frontend and Express.js for the backend, utilizing SQLite for data storage. It features a simple and intuitive interface for managing notes, each with titles, contents, and tags.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Node.js (Download [here](https://nodejs.org/en/))
- npm (Comes with Node.js installation)

## Setting Up

To get the project up and running on your local machine, follow these steps:

### Clone the Repository

First, clone this repository to your local machine using:

```bash
git clone https://github.com/Extoren/Treningsdagbok.git
cd Treningsdagbok
```

### Database Setup

The application uses SQLite to store data. No initial setup is required as SQLite will create the database file when you run the server if it doesn't already exist.

### Starting the Backend Server

To start the Express server, navigate to the server directory and run:

```bash
npm start // Or `node server.js` if you prefer to run directly
```

This will start the backend server on `http://localhost:3001`. Ensure that the server is running properly and that there are no errors in the console.

### Starting the React Application

Open a new terminal and navigate to the client directory:

```bash
cd path/to/client
npm start
```

This command runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits. You will also see any lint errors in the console.

## Usage

After starting both the server and client, you can access the application through your web browser at `http://localhost:3000`. 

- **Login/Register**: First, register a new user or log in.
- **Add Notes**: Click the "+" button down left to create a new note.
- **Edit Notes**: Click on any note field (title, content, or tags) to edit its information.
- **Save Notes**: Click the "Save" button to save changes to a note.
- **Delete Notes**: Click the "Delete" button to remove a note permanently.

## Deployment

Refer to the `deployment` section for instructions on how to deploy the application to a live system.

## Further Help

For more information on how to use Create React App, you can find the full documentation [here](https://facebook.github.io/create-react-app/docs/getting-started).

For more details on React itself, check the [React documentation](https://reactjs.org/).

---

I hope you enjoy using this application!