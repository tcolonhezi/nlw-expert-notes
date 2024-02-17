import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Note } from "../models/note";
import { ChangeEvent, useState } from "react";

interface NoteCardProps {
  note: Note;
  onNoteDeleted: (id: string) => void;
  onNoteEdited: (id: string, title: string, content: string) => void;
}

export function NoteCard({ note, onNoteDeleted, onNoteEdited }: NoteCardProps) {
  const [shouldEditNote, setShouldEditNote] = useState(false);
  const [content, setContent] = useState("");
  const [titleNote, setTitle] = useState("");

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  function handleTitleNoteChanged(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleStartEditNote() {
    setShouldEditNote(true);
    setTitle(note.titleNote);
    setContent(note.content);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-500">
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>
        <p className="text-md pt-2 leading-6 text-slate-300 ">
          {note.titleNote}
        </p>
        <p className="text-sm pt-2 leading-6 text-slate-400 ">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none"></div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>

            {shouldEditNote ? (
              <input
                type="text"
                placeholder="Digite o título da nota..."
                className="bg-transparent outline-none"
                onChange={handleTitleNoteChanged}
                value={titleNote}
              ></input>
            ) : (
              <p className="text-sm leading-6 text-slate-400 ">
                {note.titleNote}
              </p>
            )}

            {shouldEditNote ? (
              <textarea
                autoFocus
                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                onChange={handleContentChanged}
                value={content}
              />
            ) : (
              <p className="text-sm leading-6 text-slate-400 ">
                {note.content}
              </p>
            )}
          </div>

          {shouldEditNote ? (
            <button
              onClick={() => {
                onNoteEdited(note.id, titleNote, content);
                setShouldEditNote(false);
              }}
              type="button"
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
            >
              <span>Salvar nota</span>
            </button>
          ) : (
            <div className="flex justify-between p-2">
              <button
                type="button"
                onClick={handleStartEditNote}
                className="w-1/2 m-2 rounded-md bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
              >
                Deseja{" "}
                <span className="text-lime-400 group-hover:underline">
                  editar essa nota
                </span>
                ?
              </button>
              <AlertDialog.Root>
                <AlertDialog.Trigger className="w-1/2 m-2">
                  <button
                    type="button"
                    className="w-full rounded-md bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
                  >
                    Deseja{" "}
                    <span className="text-red-400 group-hover:underline">
                      apagar essa nota
                    </span>
                    ?
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="inset-0 fixed bg-black/50" />
                  <AlertDialog.Content className="text-left fixed overflow-hidden inset-0 inset-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[500px] p-5 bg-slate-700 rounded-md flex flex-col outline-none">
                    <AlertDialog.Title>Você tem certeza?</AlertDialog.Title>
                    <AlertDialog.Content className="">
                      Essa ação não terá retorno.
                    </AlertDialog.Content>
                    <div className=" flex justify-between p-1">
                      <AlertDialog.Cancel className="w-1/2 m-2 rounded-md bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium">
                        <button type="button" className="">
                          Não
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action className="w-1/2 m-2 rounded-md bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium">
                        <button
                          type="button"
                          onClick={() => onNoteDeleted(note.id)}
                          className=""
                        >
                          Sim
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
