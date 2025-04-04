import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoCloseSharp } from "react-icons/io5";

const Notepad = ({ notepadVisibility }) => {
  const [text, setText] = useState("");

  const notepadRef = useRef(null); // Ref to hide Notepad whenever clicks outside the translator div

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notepadRef.current &&
        !notepadRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          notepadVisibility(false); // ✅ Hide translator after delay
        }, 300); // ⏳ 1.5-second delay
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={notepadRef} className="p-4 w-[55vw] mx-auto h-60 bg-[#202C33] text-[#AEBAC1] shadow-lg rounded-lg absolute bottom-full mb-6">
      <span className="flex justify-between mb-2 items-center">
        <h2 className="text-xl font-semibold">Format Your Text Here</h2>
        <button
          className="text-2xl font-bold bg-red-500 text-white px-1 py-1 rounded-md hover:bg-red-600 transition"
          onClick={() => notepadVisibility(false)} // Hide on cancel
        >
          <IoCloseSharp />
        </button>
      </span>
      <ReactQuill
        value={text}
        onChange={setText}
        modules={Notepad.modules}
        formats={Notepad.formats}
        style={{ minHeight: "80px", height: "100%", maxHeight: "100px" }}
      />
      <style>
        {`
          .ql-editor {
            color: #AEBAC1 !important;  /* Text color */
            font-size: 16px;
           
          }
          .ql-toolbar {
           color: #AEBAC1 !important;  /* Text color */
           font-size: 16px !important;
          }
        `}
      </style>
    </div>
  );
};

// Quill.js Modules for Toolbar Options
Notepad.modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"], // Remove formatting
  ],
};

// Allowed Formats
Notepad.formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "align",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
  "image",
  "video",
];

export default Notepad;
