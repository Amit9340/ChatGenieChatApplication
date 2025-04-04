// import { useState } from "react";
// import axios from "axios";

// const TranslateMessage = ({ message }) => {
//     const [translatedText, setTranslatedText] = useState("");
//     const [targetLang, setTargetLang] = useState("es"); // Default: Spanish
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // const translateText = async () => {
//     //     setLoading(true);
//     //     setError("");

//     //     try {
//     //         const response = await axios.post("http://localhost:5001/translate", {
//     //             text: message,
//     //             targetLang: targetLang,
//     //         });

//     //         setTranslatedText(response.data.translatedText);
//     //     } catch (err) {
//     //         console.error("Translation error:", err);
//     //         setError("Translation failed. Try again.");
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const translateText = async (text, targetLang) => {
//         try {
//           const response = await axios.post("http://localhost:5000/translate", {
//             text,
//             target: targetLang,
//           });
//           return response.data.translatedText;
//         } catch (error) {
//           console.error("Translation error:", error);
//           return "Translation failed";
//         }
//       };

//     return (
//         <div className="p-4 border rounded shadow-lg bg-gray-800 text-white absolute bottom-full mb-6">
//             <p>Original: {message}</p>

//             <select
//                 className="p-2 mb-2 bg-gray-700 border border-gray-600"
//                 value={targetLang}
//                 onChange={(e) => setTargetLang(e.target.value)}
//             >
//                 <option value="es">Spanish</option>
//                 <option value="fr">French</option>
//                 <option value="de">German</option>
//                 <option value="hi">Hindi</option>
//             </select>

//             <button
//                 className="ml-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
//                 onClick={() => translateText(message, targetLang)}
//                 disabled={loading}
//             >
//                 {loading ? "Translating..." : "Translate"}
//             </button>

//             {translatedText && <p className="mt-4 text-green-400">Translated: {translatedText}</p>}
//             {error && <p className="mt-2 text-red-400">{error}</p>}
//         </div>
//     );
// };

// export default TranslateMessage;




// import { useState } from "react";
// import axios from "axios";

// const TranslateMessage = () => {
//   const [inputText, setInputText] = useState("");
//   const [translatedText, setTranslatedText] = useState("");
//   const [inputLang, setInputLang] = useState("auto"); // Auto-detect language
//   const [targetLang, setTargetLang] = useState("es"); // Default output language: Spanish
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const translateText = async () => {
//     setLoading(true);
//     setError("");
//     setTranslatedText("");

//     try {
//       const response = await axios.post("http://localhost:5000/translate", {
//         text: inputText,
//         target: targetLang,
//       });

//       setTranslatedText(response.data.translatedText);
//     } catch (err) {
//       console.error("Translation error:", err);
//       setError("Translation failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="border rounded shadow-lg bg-gray-800 text-white w-full">
//       <div className="flex">
//         {/* Input Section */}
//         <div className="mb-4 flex flex-col w-[50%] p-5">
//           <label className="block text-sm mb-1">
//             Input Language: </label>
//             <select
//               className="p-2 w-full mb-2 bg-gray-700 border border-gray-600 rounded"
//               value={inputLang}
//               onChange={(e) => setInputLang(e.target.value)}
//             >
//               <option value="auto">Auto Detect</option>
//               <option value="en">English</option>
//               <option value="es">Spanish</option>
//               <option value="fr">French</option>
//               <option value="de">German</option>
//               <option value="hi">Hindi</option>
//             </select>
//             <label htmlFor="">Your Text</label>
//             <textarea
//               className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
//               rows="3"
//               placeholder="Enter text..."
//               value={inputText}
//               onChange={(e) => setInputText(e.target.value)}
//             ></textarea>
//         </div>

//         {/* Target Language Selection & Translated Output */}
//         <div className="mb-4 flex flex-col w-[50%] p-5">
//           <label className="block text-sm mb-1">Output Language:</label>
//           <select
//             className="p-2 w-full bg-gray-700 border border-gray-600 rounded"
//             value={targetLang}
//             onChange={(e) => setTargetLang(e.target.value)}
//           >
//             <option value="es">Spanish</option>
//             <option value="fr">French</option>
//             <option value="de">German</option>
//             <option value="hi">Hindi</option>
//           </select>

//           <label className="block text-sm mb-1">Translated Text:</label>
//           <textarea
//             className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
//             rows="3"
//             value={translatedText}
//             readOnly
//           ></textarea>
//         </div>
//       </div>

//       {/* Translate Button */}
//       <button
//         className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
//         onClick={translateText}
//         disabled={loading}
//       >
//         {loading ? "Translating..." : "Translate"}
//       </button>

//       {/* Error Message */}
//       {error && <p className="mt-2 text-red-400">{error}</p>}
//     </div>
//   );
// };

// export default TranslateMessage;
