import React from "react";

export default function StickerPopup({ onClose }) {
  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 p-4 w-[300px] bg-white shadow-lg rounded-lg">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Choose a Sticker</h3>
        <button onClick={onClose} className="text-xl text-gray-500">
          ×
        </button>
      </div>
      {/* Add your sticker content here */}
      <div className="grid grid-cols-4 gap-2">
        <div className="w-16 h-16 bg-gray-200 rounded-lg">Sticker 1</div>
        <div className="w-16 h-16 bg-gray-200 rounded-lg">Sticker 2</div>
        <div className="w-16 h-16 bg-gray-200 rounded-lg">Sticker 3</div>
        <div className="w-16 h-16 bg-gray-200 rounded-lg">Sticker 4</div>
      </div>
    </div>
  );
}

export function StickerIcon() {
  return (
    <svg width="53" height="53" fill="none" viewBox="0 0 53 53">
      <g clipPath="url(#clip0_850:74884)">
        <circle cx="26.5" cy="26.5" r="26.5" fill="#0063CB"></circle>
        <path
          fill="#0070E6"
          d="M53 26.5C53 41.136 41.136 53 26.5 53S0 41.136 0 26.5h53z"
        ></path>
        <path
          fill="#F7F7F7"
          fillRule="evenodd"
          d="M36.002 22.17v4.32c-.24.321-.624.53-1.056.53H33.14a6.12 6.12 0 00-6.12 6.12v1.804c0 .434-.209.818-.532 1.058H22.17a5.17 5.17 0 01-5.17-5.17V22.17A5.17 5.17 0 0122.17 17h8.662a5.17 5.17 0 015.17 5.17zm-5.48 3.33l.937-2.063 2.063-.937-2.063-.938-.937-2.062-.938 2.063-2.062.937 2.062.938.938 2.062zm-7.022-3l1.406 3.094L28 27l-3.094 1.406L23.5 31.5l-1.406-3.094L19 27l3.094-1.406L23.5 22.5z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#F7F7F7"
          d="M34.946 28.52c.352 0 .69-.065 1-.183a3.87 3.87 0 01-1.078 2.088l-4.443 4.443a3.87 3.87 0 01-2.087 1.079 2.81 2.81 0 00.184-1.003V33.14a4.62 4.62 0 014.62-4.62h1.804z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_850:74884">
          <path fill="#fff" d="M0 0H53V53H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
