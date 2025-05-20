// === frontend/src/components/Chat/ScreenShare/IncomingRequest.js ===

import React from "react";

const IncomingRequest = ({ senderInfo, onAccept, onReject }) => {
  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-dark_bg_2 p-4 rounded shadow-xl z-50">
      <p className="text-black dark:text-white mb-2">
        {senderInfo?.name || "Someone"} wants to share their screen with you.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Accept
        </button>
        <button
          onClick={onReject}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default IncomingRequest;
