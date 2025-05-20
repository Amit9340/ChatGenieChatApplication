// // backend/socket/screenShareSocket.js
//  const screenShareSocket = (io) => {
//     io.on("connection", (socket) => {
//       console.log("User connected:", socket.id);
  
//       socket.on("start-call", ({ to }) => {
//         io.to(to).emit("incoming-call", { from: socket.id });
//       });
  
//       socket.on("send-offer", ({ offer, to }) => {
//         io.to(to).emit("receive-offer", { offer, from: socket.id });
//       });
  
//       socket.on("send-answer", ({ answer, to }) => {
//         io.to(to).emit("receive-answer", { answer, from: socket.id });
//       });
  
//       socket.on("send-ice-candidate", ({ candidate, to }) => {
//         io.to(to).emit("receive-ice-candidate", { candidate, from: socket.id });
//       });
  
//       socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//       });
//     });
//   };
  
// export default screenShareSocket;

  
// === backend/src/screenShareSocket.js ===

export default function screenShareSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    // Send request to the receiver
    socket.on("request-screen-share", ({ from, to, senderInfo }) => {
      console.log(`Screen share request from ${from} to ${to}`);
      io.to(to).emit("incoming-screen-share-request", { from, senderInfo });
    });

    // Handle accept/reject
    socket.on("screen-share-response", ({ from, to, accepted }) => {
      console.log(`Screen share response from ${to} to ${from} — Accepted: ${accepted}`);
      io.to(to).emit("screen-share-response-result", { from, accepted });
    });

    // Exchange WebRTC offer/answer
    socket.on("send-offer", ({ offer, to }) => {
      console.log(`Sending WebRTC offer to ${to} from ${socket.id}`);
      io.to(to).emit("receive-offer", { offer, from: socket.id });
    });

    socket.on("send-answer", ({ answer, to }) => {
      console.log(`Sending WebRTC answer to ${to}`);
      io.to(to).emit("receive-answer", { answer });
    });

    socket.on("send-ice-candidate", ({ candidate, to }) => {
      console.log(`Sending ICE candidate to ${to}`);
      io.to(to).emit("receive-ice-candidate", { candidate });
    });

    // Stop sharing
    socket.on("stop-screen-share", ({ to }) => {
      console.log(`Screen share stopped, notifying ${to}`);
      io.to(to).emit("screen-share-stopped");
    });
  });
}


// === backend/src/screenShareSocket.js ===
// let screenSharingSessions = {}; // { chatId: { from, to, isSharing } }

// io.on('connection', (socket) => {
//   socket.on('start-screen-share-request', ({ fromUser, toUser, chatId }) => {
//     io.to(toUser.socketId).emit('receive-screen-share-request', { fromUser, chatId });
//   });

//   socket.on('respond-screen-share-request', ({ chatId, accept, fromUser, toUser }) => {
//     if (accept) {
//       screenSharingSessions[chatId] = { from: fromUser._id, to: toUser._id, isSharing: true };
//       io.to(fromUser.socketId).emit('screen-share-accepted', { chatId });
//       io.to(toUser.socketId).emit('start-screen-receive', { chatId });
//     } else {
//       io.to(fromUser.socketId).emit('screen-share-rejected', { chatId });
//     }
//   });

//   socket.on('screen-stream', ({ chatId, stream }) => {
//     const session = screenSharingSessions[chatId];
//     if (session && session.isSharing) {
//       io.to(session.to.socketId).emit('display-screen', stream);
//     }
//   });

//   socket.on('stop-screen-share', ({ chatId }) => {
//     delete screenSharingSessions[chatId];
//     io.to(chatId).emit('screen-share-ended', { chatId });
//   });
// });
