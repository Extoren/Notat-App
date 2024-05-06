const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const WORKOUTS_FILE = './data/workouts.json';

app.use(cors());
app.use(bodyParser.json());

// Ensure the workouts.json file exists
if (!fs.existsSync(WORKOUTS_FILE)) {
  fs.writeFileSync(WORKOUTS_FILE, JSON.stringify([]), 'utf8');
}

// GET endpoint to retrieve workouts
app.get('/workouts', (req, res) => {
  fs.readFile(WORKOUTS_FILE, (err, data) => {
    if (err) {
      res.status(500).send('Error reading data file.');
    } else {
      res.send(data);
    }
  });
});

// POST endpoint to add a new workout
app.post('/workouts', (req, res) => {
  const newWorkout = req.body;
  fs.readFile(WORKOUTS_FILE, (err, data) => {
    if (err) {
      res.status(500).send('Error reading data file.');
    } else {
      const workouts = JSON.parse(data);
      workouts.push({...newWorkout, id: Date.now()});  // Adding a unique ID based on timestamp
      fs.writeFile(WORKOUTS_FILE, JSON.stringify(workouts, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error writing data file.');
        } else {
          res.status(201).send('Workout added successfully.');
        }
      });
    }
  });
});

// DELETE endpoint to remove a workout
app.delete('/workouts/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile(WORKOUTS_FILE, (err, data) => {
      if (err) {
        res.status(500).send('Error reading data file.');
      } else {
        let workouts = JSON.parse(data);
        workouts = workouts.filter(workout => workout.id !== parseInt(id));
        fs.writeFile(WORKOUTS_FILE, JSON.stringify(workouts, null, 2), err => {
          if (err) {
            res.status(500).send('Error writing data file.');
          } else {
            res.send('Workout deleted successfully.');
          }
        });
      }
    });
  });  

// PATCH endpoint to update a workout
app.patch('/workouts/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  fs.readFile(WORKOUTS_FILE, (err, data) => {
    if (err) {
      res.status(500).send('Error reading data file.');
    } else {
      let workouts = JSON.parse(data);
      const index = workouts.findIndex(workout => workout.id === parseInt(id));
      if (index !== -1) {
        workouts[index] = { ...workouts[index], ...updateData };
        fs.writeFile(WORKOUTS_FILE, JSON.stringify(workouts, null, 2), err => {
          if (err) {
            res.status(500).send('Error writing data file.');
          } else {
            res.send('Workout updated successfully.');
          }
        });
      } else {
        res.status(404).send('Workout not found.');
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
