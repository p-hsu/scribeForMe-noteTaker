// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');

// require db.json to eliminate need for fs.readFile
const db = require('./db/db.json')
const {v4 : uuidv4} = require('uuid');

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Express app middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

//API routes
// GET: /api/notes to res.json required db.json file 'db'
app.get('/api/notes', (req, res) => res.json(db));

// POST: /api/notes to create newNote and saveNote
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let dbPath = path.join(__dirname, './db/db.json')
    // set unique id
    newNote.id = uuidv4();
    // push newNote object to req data
    db.push(newNote)
    console.log(db);
    // update json to db.json > don't forget to stringify
    fs.writeFile(dbPath, JSON.stringify(db), (err) => {
      err ? console.error(`FAILED TO WRITE >>>>`, err) : console.log(`New note saved!`)
    });
    res.json(newNote);
})


// DELETE note using id of notes, .splice at index 1
app.delete('/api/notes/:id', (req, res) => {
  let noteId = req.params.id;
  let dbPath = path.join(__dirname, './db/db.json')
  // for loop to search through array, match, then splice
  for (let i = 0; i < db.length; i++ ) {
    if (db[i].id === noteId) {
      db.splice(i, 1);
      break;
    }
  }

  // .forEach to replace for loop
  // db.forEach((note, i) => {
  //   if (db[i].id === noteId) {
  //     db.splice(i, 1);
  //   }
  // })

  // update json to db.json > don't forget to stringify JSON
  fs.writeFile(dbPath, JSON.stringify(db), (err) => {
    err ? console.error('FAILED TO DELETE NOTES >>>>', err) : console.log(`Delete sucessful!`)
  });
  res.json(db)
})

// Starts server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
