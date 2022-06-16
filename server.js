const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

// Parse JSON bodies for this app.
app.use(express.json());

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "notes.html"))
);

app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});

// default route
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
  };

  saveNote(newNote);

  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  let id = req.params.id;

  console.log("Delete called for ID", id);
  let notesArr = readNotes().filter((note) => note.id !== id);

  writeNotes(notesArr);
  res.json(notesArr);
});

app.listen(PORT, () =>
  console.log(`Note-taking app listening at http://localhost:${PORT}`)
);

// ---move this section to a util module

readNotes = () => {
  const fileContent = JSON.parse(fs.readFileSync("./db/db.json"));

  //console.log("db.json", fileContent);
  return fileContent;
};

writeNotes = (notes) => {
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
};

saveNote = (note) => {
  const notesArr = readNotes();

  notesArr.push(note);

  console.log("saveNote-notes", notesArr);

  writeNotes(notesArr);
};
