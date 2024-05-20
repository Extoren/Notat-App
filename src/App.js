import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';

function App() {
  const [notes, setNotes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchTags, setSearchTags] = useState('');

  useEffect(() => {
    const isAuthed = localStorage.getItem('isLoggedIn') === 'true';
    setLoggedIn(isAuthed);
  }, []);

  const signOut = () => {
    localStorage.removeItem('isLoggedIn'); 
    setLoggedIn(false);
  };

  const fetchNotes = async (tags = '') => {
    if (!loggedIn) return;
    try {
      const response = await fetch(`http://localhost:3001/${tags ? `searchNotes?userId=1&tags=${tags}` : 'notes?userId=1'}`);
      if (response.ok) {
        const fetchedNotes = await response.json();
        const parsedNotes = fetchedNotes.map(note => ({
          ...note,
          tags: note.tags ? note.tags.split(',').map(tag => tag.trim()) : [],
        }));
        setNotes(parsedNotes);
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
        body: JSON.stringify({ ...note, tags: note.tags.join(','), userId: 1 })
      });
      if (response.ok) {
        fetchNotes();
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
        fetchNotes();
      } else {
        const errorResponse = await response.json();
        throw new Error('Error deleting note: ' + errorResponse.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addNote = () => {
    const newNote = { id: notes.length + 1, title: '', content: '', tags: [], userId: 1 };
    setNotes([...notes, newNote]);
  };

  const exportNotes = async () => {
    try {
      const response = await fetch('http://localhost:3001/exportNotes?userId=1');
      if (response.ok) {
        const notesData = await response.json();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notesData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "notes.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      } else {
        throw new Error('Error exporting notes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const importNotes = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const notesData = JSON.parse(e.target.result);
        const response = await fetch('http://localhost:3001/importNotes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: 1, notes: notesData })
        });
        if (response.ok) {
          fetchNotes();
        } else {
          throw new Error('Error importing notes');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchNotes(searchTags);
  };

  const handleTagSave = async (noteId, newTag) => {
    try {
      const updatedNotes = notes.map(note => {
        if (note.id === noteId) {
          const updatedTags = [...note.tags, newTag.trim()];
          const updatedNote = { ...note, tags: updatedTags };
          handleSave(updatedNote);
          return updatedNote;
        }
        return note;
      });
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!loggedIn ? <LoginPage onLoginSuccess={() => setLoggedIn(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={loggedIn ? (
            <div className='board'>
              <h1>Notat Applikasjon</h1>
              <button onClick={signOut}>Sign Out</button>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Søk etter tags (separert med komma)"
                  value={searchTags}
                  onChange={(e) => setSearchTags(e.target.value)}
                />
                <button type="submit">Søk</button>
              </form>
              <div className="note-board">
                {notes.map(note => (
                  <div key={note.id} className="note">
                    <input type="text" placeholder="Title" defaultValue={note.title} onChange={(e) => note.title = e.target.value} />
                    <textarea defaultValue={note.content} onBlur={(e) => note.content = e.target.value} />
                    <div className="tags">
                      {note.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                      <input type="text" placeholder="New tag" onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.target.value.trim() !== '') {
                            handleTagSave(note.id, e.target.value);
                            e.target.value = '';
                          }
                        }
                      }} />
                    </div>
                    <button onClick={() => handleSave(note)}>Save</button>
                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                  </div>
                ))}
                <button className="add-note-button" onClick={addNote}>+</button>
              </div>
              <button onClick={exportNotes}>Export Notes</button>
              <input type="file" onChange={importNotes} />
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;