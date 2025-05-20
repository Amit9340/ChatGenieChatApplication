import React, { useEffect, useState } from 'react';
import socket from "./ScreenShareSocket";
import { useSelector } from 'react-redux';

const ScreenReceivePopup = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [request, setRequest] = useState(null);
  const [showStream, setShowStream] = useState(null);

  useEffect(() => {
    socket.on('receive-screen-share-request', ({ fromUser, chatId }) => {
      setRequest({ fromUser, chatId });
    });

    socket.on('start-screen-receive', ({ chatId }) => {
      // start rendering the stream
    });

    socket.on('display-screen', (bitmap) => {
      const canvas = document.getElementById("screen-canvas");
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      }
    });

    socket.on('screen-share-ended', () => {
      setShowStream(null);
    });
  }, [socket]);

  const respond = (accept) => {
    socket.emit('respond-screen-share-request', {
      accept,
      chatId: request.chatId,
      fromUser: request.fromUser,
      toUser: currentUser
    });
    setRequest(null);
  };

  return (
    <>
      {request && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <p>{request.fromUser.name} wants to share their screen.</p>
            <div className="flex gap-4 mt-4">
              <button onClick={() => respond(true)} className="bg-green-500 text-white px-4 py-2 rounded">
                Accept
              </button>
              <button onClick={() => respond(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {showStream && <canvas id="screen-canvas" className="w-full h-full" />}
    </>
  );
};

export default ScreenReceivePopup;
