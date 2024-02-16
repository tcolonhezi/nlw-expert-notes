import { Note } from "../models/note";
import { NewNoteCard } from "./new-note-card";
import { NoteCard } from "./note-card";

interface Props {
  filteredNotes: Note[];
  onNoteDeleted: (id: string) => void;
  onNoteCreated: (title: string, content: string) => void;
  onNoteEdited: (id: string, title: string, content: string) => void;
}

export function Cards({
  filteredNotes,
  onNoteDeleted,
  onNoteCreated,
  onNoteEdited,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
      <NewNoteCard onNoteCreated={onNoteCreated} title="" />

      {filteredNotes.map((note) => {
        return (
          <NoteCard
            key={note.id}
            note={note}
            onNoteDeleted={onNoteDeleted}
            onNoteEdited={onNoteEdited}
          />
        );
      })}
    </div>
  );
}
