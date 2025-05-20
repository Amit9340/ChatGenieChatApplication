// // frontend/src/call/ScreenShare/ScreenShareSocket.js
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000'); // adjust for prod

// export default socket;


// === frontend/src/components/Chat/ScreenShare/ScreenShareSocket.js ===
import io from "socket.io-client";
const socket = io("http://localhost:5000"); // replace with your backend URL

socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

export default socket;
