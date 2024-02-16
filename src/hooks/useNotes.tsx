import { Note } from "../models/note";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface NoteContextData {
  note: Note | null;
  setNote: Dispatch<SetStateAction<Note | null>>;
}

export const NoteContext = createContext<NoteContextData>(
  {} as NoteContextData
);

interface Props {
  children: ReactNode;
}

export const NoteProvider = ({ children }: Props) => {
  const [note, setNote] = useState<Note | null>(null);
  return (
    <NoteContext.Provider value={{ note, setNote }}>
      {children}
    </NoteContext.Provider>
  );
};
