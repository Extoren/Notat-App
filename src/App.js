import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({date: '', duration: '', notes: ''});

  useEffect(() => {
    fetch('/workouts')
      .then(response => response.json())
      .then(data => setWorkouts(data))
      .catch(error => console.error('Error fetching workouts:', error));
  }, []);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const method = editing ? 'PATCH' : 'POST';
    const url = editing ? `/workouts/${editing.id}` : '/workouts';
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(() => {
      fetch('/workouts').then(response => response.json()).then(data => setWorkouts(data));
      setEditing(null);
      setFormData({date: '', duration: '', notes: ''});
    })
    .catch(error => console.error('Error saving workout:', error));
  };

  const startEditing = (workout) => {
    setEditing(workout);
    setFormData(workout);
  };

  const cancelEditing = () => {
    setEditing(null);
    setFormData({date: '', duration: '', notes: ''});
  };

  const handleDelete = (id) => {
    fetch(`/workouts/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      fetch('/workouts').then(response => response.json()).then(data => setWorkouts(data));
    })
    .catch(error => console.error('Error deleting workout:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Workouts</h1>
        <form onSubmit={handleSubmit}>
          <input type="date" name="date" value={formData.date} onChange={handleFormChange} required />
          <input type="number" name="duration" value={formData.duration} onChange={handleFormChange} required placeholder="Duration in minutes" />
          <input type="text" name="notes" value={formData.notes} onChange={handleFormChange} required placeholder="Notes" />
          <button type="submit">{editing ? 'Update' : 'Add'} Workout</button>
          {editing && <button onClick={cancelEditing}>Cancel</button>}
        </form>
        <ul>
          {workouts.map(workout => (
            <li key={workout.id}>
              {workout.date} - Duration: {workout.duration} minutes, Notes: {workout.notes}
              <button onClick={() => startEditing(workout)}>Edit</button>
              <button onClick={() => handleDelete(workout.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
