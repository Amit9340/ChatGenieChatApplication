import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";

const TranslateMessage = ({ TranslatorVisibility }) => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [inputLang, setInputLang] = useState("auto"); // Auto-detect language
  const [targetLang, setTargetLang] = useState("es"); // Default output language: Spanish
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const translatorRef = useRef(null); // Ref to hide translator whenever clicks outside the translator div

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (translatorRef.current && !translatorRef.current.contains(event.target)) {
        setTimeout(() => {
          TranslatorVisibility(false); // ✅ Hide translator after delay
        }, 300); // ⏳ 1.5-second delay
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 
  

  const translateText = async () => {
    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      const response = await axios.post("http://localhost:5000/translate", {
        text: inputText,
        target: targetLang,
      });

      setTranslatedText(response.data.translatedText);
    } catch (err) {
      console.error("Translation error:", err);
      setError("Translation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={translatorRef} className="border rounded shadow-lg bg-gray-800 text-white w-[55vw] absolute bottom-full mb-6">
      <div className="flex justify-between mb-2 items-center m-6">
        <h1 className="text-2xl font-bold">ChatGenie Text Translator</h1>
        <button
          className="text-2xl font-bold bg-red-500 text-white px-1 py-1 rounded-md hover:bg-red-600 transition"
          onClick={() => TranslatorVisibility(false)} // Hide on cancel
        >
          <IoCloseSharp />
        </button>
      </div>
      <div className="flex">
        {/* Input Section */}
        <div className="mb-4 flex flex-col w-[50%] p-5">
          <label className="block text-sm mb-1">Input Language: </label>
          <select
            className="p-2 w-full mb-2 bg-gray-700 border border-gray-600 rounded size-10"
            value={inputLang}
            onChange={(e) => setInputLang(e.target.value)}
          >
            <option value="auto">Auto Detect</option>
            <option value="hi">Hindi</option>
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="gu">Gujarati</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
          <label htmlFor="">Your Text</label>
          <textarea
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            rows="3"
            placeholder="Enter text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>

        {/* Target Language Selection & Translated Output */}
        <div className="mb-4 flex flex-col w-[50%] p-5">
          <label className="block text-sm mb-1">Output Language:</label>
          <select
            className="p-2 w-full bg-gray-700 border border-gray-600 rounded"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="hi">Hindi</option>
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="gu">Gujarati</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>

          <label className="block text-sm mb-1">Translated Text:</label>
          <textarea
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            rows="3"
            value={translatedText}
            readOnly
          ></textarea>
        </div>
      </div>

      {/* Translate Button */}
      <button
        className="px-6 py-3 relative left-[42%] mb-5 bg-blue-500 rounded hover:bg-blue-600"
        onClick={translateText}
        disabled={loading}
      >
        {loading ? "Translating..." : "Translate text"}
      </button>

      {/* Error Message */}
      {error && <p className="mt-2 text-red-400">{error}</p>}
    </div>
  );
};

export default TranslateMessage;
