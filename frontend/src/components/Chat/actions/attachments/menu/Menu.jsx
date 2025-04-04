import { useState } from "react";
import {
  CameraIcon,
  ContactIcon,
  DocumentIcon,
  PollIcon,
} from "../../../../../svg";
import DocumentAttachment from "./DocumentAttachment";
import PhotoAttachment from "./PhotoAttachment";
import StickerIcon from "./StickerIcon";
import StickerPopup from "./StickerIcon";
import { LuNotepadText } from "react-icons/lu";
import { MdOutlineTranslate } from "react-icons/md";
import TranslateMessage from "../TranslateMessage";

export default function Menu({ notepad, translate }) {
  const [isNotepad, setIsNotepad] = useState(false);
  const notepadHide = () => {
    setIsNotepad(true);
    notepad(true);
  };

  // const [isNotepad, setIsNotepad] = useState(false);
  const translatorHide = () => {
    setIsNotepad(true);
    translate(true);
  };

  const [isStickerPopupVisible, setStickerPopupVisible] = useState(false);
  // Function to handle showing/hiding the sticker popup
  const toggleStickerPopup = () => {
    setStickerPopupVisible(!isStickerPopupVisible);
  };
  return (
    <>
      {!isNotepad && (
        <ul className="absolute bottom-14 openEmojiAnimation flex gap-4">
          {/* Poll Icon */}
          <li className="group flex flex-col items-center">
            <button type="button" className="rounded-full">
              <PollIcon />
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Poll
            </span>
          </li>

          {/* contact icon */}
          {/* <li className="group flex flex-col items-center">
            <button type="button" className="bg-[#0EABF4] rounded-full">
              <ContactIcon />
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Contact
            </span>
          </li> */}
          
          {/* Document Attachment */}
          <div className="group flex flex-col items-center">
            <DocumentAttachment />
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Attach Document
            </span>
          </div>

          {/* Camera Icon */}
          <li className="group flex flex-col items-center">
            <button type="button" className="bg-[#D3396D] rounded-full">
              <CameraIcon />
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Camera
            </span>
          </li>

          {/* sticker icon */}
          {/* <li className="group flex flex-col items-center">
            <button
              type="button"
              onClick={toggleStickerPopup}
              className="rounded-full"
            >
              <StickerIcon />
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Stickers
            </span>
          </li> */}
          {/* Sticker Popup - Only show when isStickerPopupVisible is true */}
          {/* {isStickerPopupVisible && (
            <StickerPopup onClose={toggleStickerPopup} />
          )} */}

          {/* Photo Attachment */}
          <div className="group flex flex-col items-center">
            <PhotoAttachment />
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Attach Images
            </span>
          </div>

          {/* Notepad Icon */}
          <div
            onClick={notepadHide}
            className="cursor-pointer group flex flex-col items-center"
          >
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Notepad
            </span>
            <LuNotepadText className="bg-[#1A5DB9] text-[#F4F7F7] text-[3.4rem] rounded-full p-2" />
          </div>

          {/* Translator Icon */}
          <div
            onClick={translatorHide}
            className="cursor-pointer group flex flex-col items-center"
          >
            <span className="absolute bottom-full mb-2 hidden group-hover:block text-white text-sm">
              Translator
            </span>
            <MdOutlineTranslate className="bg-[#1A5DB9] text-[#F4F7F7] text-[3.4rem] rounded-full p-2" />
          </div>
        </ul>
      )}
    </>
  );
}
