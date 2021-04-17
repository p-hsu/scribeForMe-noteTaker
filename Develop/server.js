// Dependencies
const express = require('express');
const { fstat } = require('fs');
const path = require('path');

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

//API routes
// GET: /api/notes to fs.readFile db.json and return all saved notes as JSON (res.json)
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`FAILED TO READ >>>>`, err)
      return
    }
    console.log(`FILE READ >>>>`, data)
    res.json(data);
  }))
})

// POST: /api/notes to create newNote and saveNote
  // newNote from req.body

// DELETE deleteNote?

// Starts server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
