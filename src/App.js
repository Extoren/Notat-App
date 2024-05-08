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

  const handleEdit = async (note) => {
    const response = await fetch(`http://localhost:3001/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note)
    });
    if (response.ok) {
      fetchNotes();  // Refresh notes to show any updates
    } else {
      console.error('Error updating note');
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={loggedIn ? (
            <div className='board'>
              <h1>Notat Applikasjon</h1>
              <div className="note-board">
                {notes.map(note => (
                  <div key={note.id} className="note">
                    <input type="text" placeholder="Title" defaultValue={note.title} onChange={(e) => note.title = e.target.value} />
                    <textarea defaultValue={note.content} onChange={(e) => note.content = e.target.value} />
                    <input type="text" placeholder="Tags" defaultValue={note.tags} onChange={(e) => note.tags = e.target.value} />
                    <div>Date Added: {note.createdAt}</div>
                    <div>Last Modified: {note.modifiedAt}</div>
                    <button onClick={() => handleEdit(note)}>Edit</button>
                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                  </div>
                ))}
                <button className="add-note-button" onClick={addNote}>Add Note</button>
              </div>
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
