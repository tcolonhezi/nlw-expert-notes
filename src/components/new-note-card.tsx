import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

//Aqui é onde defino os parametros do componente
interface NewNoteCardProps {
  title?: string;
  onNoteCreated: (titleNote: string, content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated, title }: NewNoteCardProps) {
  const [shouldShowOnboarding, SetShouldShowOnboard] = useState(true);
  const [titleNote, setTitleNote] = useState(title || "");
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  function handleStartEditor() {
    SetShouldShowOnboard(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value == "") {
      SetShouldShowOnboard(true);
    }
  }

  function handleTitleNoteChanged(event: ChangeEvent<HTMLInputElement>) {
    setTitleNote(event.target.value);
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    if (content === "" || titleNote === "") {
      if (content === "") {
        toast.message("Preencha o conteúdo para salvar.");
      }
      if (titleNote === "") {
        toast.message("Preencha o título para salvar.");
      }
      return;
    }
    onNoteCreated(titleNote, content);
    setContent("");
    setTitleNote("");
    toast.success("Nota criada com sucesso!");
    SetShouldShowOnboard(true);
  }

  function handleStartRecord() {
    const isSpeechRecognitionaAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    if (!isSpeechRecognitionaAPIAvailable) {
      alert("Seu navegador não suporta a API de gravação!");
      return;
    }

    setIsRecording(true);
    SetShouldShowOnboard(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");
      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecord() {
    setIsRecording(false);

    if (speechRecognition != null) {
      speechRecognition.stop();
    }
  }

  function handleClose() {
    setContent("");
    setTitleNote("");
    SetShouldShowOnboard(true);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-left flex flex-col rounded-md bg-slate-700 p-5 gap-y-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none ">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="size-5" onClick={handleClose} />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              <input
                type="text"
                placeholder="Digite o título da nota..."
                className="bg-transparent outline-none"
                onChange={handleTitleNoteChanged}
                value={titleNote}
              ></input>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400 ">
                  Comece{" "}
                  <button
                    type="button"
                    onClick={handleStartRecord}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                onClick={handleStopRecord}
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-ping" />
                <span>Gravando! ( Clique para interromper )</span>
              </button>
            ) : (
              <button
                onClick={handleSaveNote}
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                <span>Salvar nota</span>
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
