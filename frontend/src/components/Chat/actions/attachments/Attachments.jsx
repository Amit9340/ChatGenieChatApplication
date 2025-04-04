import { useState } from "react";
import { AttachmentIcon } from "../../../../svg";
import Menu from "./menu/Menu";
import Notepad from "./menu/Notepad";
import TranslateMessage from "./TranslateMessage";

export default function Attachments({
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) {
  const [notepad, setNotepad] = useState(false);
  const [translator, setTranslator] = useState(false);
  return (
    <li className="relative">
      <button
        onClick={() => {
          setShowPicker(false);
          setShowAttachments((prev) => !prev);
        }}
        type="button"
        className="btn"
      >
        <AttachmentIcon className="dark:fill-dark_svg_1" />
      </button>
      {/*Menu*/}
      {showAttachments ? <Menu notepad={setNotepad} translate={setTranslator} /> : null}

      {notepad && (
        <Notepad notepadVisibility={setNotepad}/>
      )}

      {/* <TranslateMessage/> */}
      {translator && (
        <TranslateMessage TranslatorVisibility={setTranslator} />
      )}

    </li>
  );
}
