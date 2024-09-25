let titles = [];
let notes = [];
let trashtitle = [];
let trashnote = [];

loadNote();
loadTrashNote();

function render() {
  let content = document.getElementById("content");
  let clearTitle = document.getElementById("note-title");
  let clearNote = document.getElementById("note-text");

  content.innerHTML = "";
  clearTitle.value = "";
  clearNote.value = "";

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    let title = titles[i];

    content.innerHTML += generateContentHTML(i, title, note);
  }
}

function generateContentHTML(i, title, note) {
  const lineBreakNote = note.replace(/\n/g, "<br>");
  return `
  <div id="notes-box_${i}" class="notes">
  <div class="menu">
    <p class="n-title" id="ntitle_${i}">${title}</p>
    <div>
    <img onclick="editNote(${i})" src="./img/edit.png" class="icons" />
    <img onclick="deleteNote(${i})" src="./img/delete.png" class="icons" />
    </div>
  </div>
  <br />
  <p class="n-text" id="ntext_${i}">${lineBreakNote}</p>
</div>`;
}

function addNote() {
  let title = document.getElementById("note-title");
  let note = document.getElementById("note-text");

  if (title.value.length == 0 || note.value.length == 0) {
    alert("Please enter your notes...");
  } else {
    titles.push(title.value);
    notes.push(note.value);
    render();
    saveNote();
  }
}

function deleteNote(i) {
  let delTitle = titles.splice(i, 1)[0];
  let delNote = notes.splice(i, 1)[0];
  trashtitle.push(delTitle);
  trashnote.push(delNote);
  render();
  saveNote();
  saveTrashNote();
}

function restoreNote(i) {
  let restTitle = trashtitle.splice(i, 1)[0];
  let restNote = trashnote.splice(i, 1)[0];

  titles.push(restTitle);
  notes.push(restNote);

  renderTrash();
  saveNote();
  saveTrashNote();
}

function saveNote() {
  let titlesAsText = JSON.stringify(titles);
  let notesAsText = JSON.stringify(notes);
  localStorage.setItem("titles", titlesAsText);
  localStorage.setItem("notes", notesAsText);
}

function loadNote() {
  let titlesAsText = localStorage.getItem("titles");
  let notesAsText = localStorage.getItem("notes");

  if (titlesAsText && notesAsText) {
    titles = JSON.parse(titlesAsText);
    notes = JSON.parse(notesAsText);
  }
}

function renderTrash() {
  let content = document.getElementById("content");
  document.getElementById("first").classList.add("d-none");
  document.getElementById("rec-btn").classList.add("d-none");
  document.getElementById("return-btn").classList.remove("d-none");

  content.innerHTML = "";
  content.innerHTML = `
    <h2>restore your note or delete it forever</h2>
    `;

  for (let i = 0; i < trashnote.length; i++) {
    const tnote = trashnote[i];
    const ttitle = trashtitle[i];

    content.innerHTML += generateTrashContentHTML(i, ttitle, tnote);
  }
}

function generateTrashContentHTML(i, ttitle, tnote) {
  const lineBreakTrashNote = tnote.replace(/\n/g, "<br>");
  return `
       <div id="notes-box_${i}" class="notes-trash">
  <div class="menu-trash">
    <p class="n-title">${ttitle}</p>
    <div>
    <img onclick="restoreNote(${i})" src="./img/restore.png" class="icons" />
    <img onclick="defDelete(${i})" src="./img/delete.png" class="icons" />
    </div>
  </div>
  <br />
  <p class="n-text">${lineBreakTrashNote}</p>
</div>`;
}

function saveTrashNote() {
  let trashTitlesAsText = JSON.stringify(trashtitle);
  let trashNotesAsText = JSON.stringify(trashnote);

  localStorage.setItem("trashtitle", trashTitlesAsText);
  localStorage.setItem("trashnote", trashNotesAsText);
}

function loadTrashNote() {
  let trashTitlesAsText = localStorage.getItem("trashtitle");
  let trashNotesAsText = localStorage.getItem("trashnote");

  if (trashTitlesAsText && trashNotesAsText) {
    trashtitle = JSON.parse(trashTitlesAsText);
    trashnote = JSON.parse(trashNotesAsText);
  }
}

function returnHome() {
  document.location.reload();
  render();
}

function defDelete(i) {
  trashtitle.splice(i, 1);
  trashnote.splice(i, 1);
  saveTrashNote();
  renderTrash();
}

function editNote(i) {
  let noteTitle = document.getElementById(`ntitle_${i}`);
  let noteText = document.getElementById(`ntext_${i}`);

  let presentTitle = titles[i];
  let presentNote = notes[i];

  noteTitle.innerHTML = `
    <input id="note-title_${i}" class="n-title" type="text" value="${presentTitle}" />
    `;
  noteText.innerHTML = `<textarea class="n-text" id="edit-text_${i}">${presentNote}</textarea>`;

  let editTitle = document.getElementById(`note-title_${i}`);
  let editNote = document.getElementById(`edit-text_${i}`);

  editSave(i, editTitle, editNote);
}

function editSave(i, editTitle, editNote) {
  if (editTitle.value.length == 0 || editNote.value.length == 0) {
    alert("Please enter your changes...");
  } else {
    editTitle.addEventListener("input", function () {
      titles[i] = this.value;
      saveNote();
    });
    editNote.addEventListener("input", function () {
      notes[i] = this.value;
      saveNote();
    });
  }
}
