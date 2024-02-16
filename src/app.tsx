import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { Note } from "./models/note";
import { NoteProvider } from "./hooks/useNotes";
import { Cards } from "./components/cards";
import { toast } from "sonner";

export function App() {
  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function onNoteCreated(titleNote: string, content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      titleNote,
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id != id;
    });

    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    toast.success("Nota removida com sucesso!");
  }

  function onNoteEdited(id: string, title: string, content: string) {
    const editedNotes = notes.map((note) =>
      note.id === id
        ? { id: note.id, date: note.date, titleNote: title, content: content }
        : note
    );

    setNotes(editedNotes);
    localStorage.setItem("notes", JSON.stringify(editedNotes));
    toast.success("Nota editada com sucesso!");
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <NoteProvider>
      <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 ">
        <img src={logo} alt="NLW Expert" />

        <form className="w-full">
          <input
            type="text"
            placeholder="Busque em suas notas..."
            className="w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder: text-slate-500"
            onChange={handleSearch}
          />
        </form>

        <div className="h-px bg-slate-700"></div>

        <Cards
          filteredNotes={filteredNotes}
          onNoteCreated={onNoteCreated}
          onNoteDeleted={onNoteDeleted}
          onNoteEdited={onNoteEdited}
        />
      </div>
    </NoteProvider>
  );
}
