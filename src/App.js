import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';

function App() {
  const [notes, setNotes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isAuthed = localStorage.getItem('isLoggedIn') === 'true';
    setLoggedIn(isAuthed);
  }, []);

  const fetchNotes = async () => {
    if (!loggedIn) return;
    try {
      const response = await fetch('http://localhost:3001/notes?userId=1'); // Assuming userId = 1 for example
      if (response.ok) {
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
      } else {
        throw new Error('Error fetching notes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [loggedIn]);

  const handleSave = async (note) => {
    try {
      const response = await fetch('http://localhost:3001/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...note, userId: 1 }) // Assuming userId = 1 for simplicity
      });
      if (response.ok) {
        fetchNotes();  // Refresh notes to show any updates
      } else {
        throw new Error('Error saving note');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/notes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchNotes();  // Refresh notes after deletion
      } else {
        const errorResponse = await response.json();
        throw new Error('Error deleting note: ' + errorResponse.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addNote = () => {
    const newNote = { id: notes.length + 1, title: '', content: '', tags: '', userId: 1 };
    setNotes([...notes, newNote]);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!loggedIn ? <LoginPage onLoginSuccess={() => setLoggedIn(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={loggedIn ? (
            <div className='board'>
              <h1>Notat Applikasjon</h1>
              <div className="note-board">
                {notes.map(note => (
                  <div key={note.id} className="note">
                    <input type="text" placeholder="Title" defaultValue={note.title} onChange={(e) => note.title = e.target.value} />
                    <textarea defaultValue={note.content} onBlur={(e) => note.content = e.target.value} />
                    <input type="text" placeholder="Tags" defaultValue={note.tags} onChange={(e) => note.tags = e.target.value} />
                    <button onClick={() => handleSave(note)}>Save</button>
                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                  </div>
                ))}
                <button className="add-note-button" onClick={addNote}>+</button>
              </div>
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
