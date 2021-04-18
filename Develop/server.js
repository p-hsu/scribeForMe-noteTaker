// Dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
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
// GET: /api/notes to fs.readFile db.json and return all saved notes as JSON (res.json)
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err
    console.log(`FILE READ >>>>`, data)
    res.json(data);
  })
})

// POST: /api/notes to create newNote and saveNote
app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`FAILED TO READ >>>>`, err)
      return
    }
    // parse data into JSON object
    let savedNotes = JSON.parse(data)
    // newNote object because need to set id as obj.param
    let newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uuidv4(),
    }
    // push newNote object to savedNotes
    savedNotes.push(newNote)
    console.log(savedNotes);
    // update json to db.json > don't forget to stringify JSON and take out id
    fs.writeFile('db/db.json',JSON.stringify(savedNotes), (err) => {
      err ? console.error(`FAILED TO WRITE >>>>`, err) : console.log(`New note saved!`)
    });
    res.json(newNote);
  });
})


// DELETE deleteNote?

// Starts server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
