// frontend/src/components/Chat/ScreenShare/ScreenShare.js
// import React, { useEffect, useRef, useState } from "react";
// import socket from "./ScreenShareSocket";

// const ScreenShare = ({ currentUserId, remoteUserId }) => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [isSharing, setIsSharing] = useState(false);

//   useEffect(() => {
//     socket.on("incoming-call", ({ from }) => {
//       createPeerConnection();
//       socket.emit("send-answer", {
//         to: from,
//         answer: peerConnection.current.localDescription,
//       });
//     });

//     socket.on("receive-offer", async ({ offer, from }) => {
//       createPeerConnection();
//       await peerConnection.current.setRemoteDescription(
//         new RTCSessionDescription(offer)
//       );
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
//       socket.emit("send-answer", { to: from, answer });
//     });

//     socket.on("receive-answer", async ({ answer }) => {
//       await peerConnection.current.setRemoteDescription(
//         new RTCSessionDescription(answer)
//       );
//     });

//     socket.on("receive-ice-candidate", ({ candidate }) => {
//       peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     return () => {
//       socket.off("incoming-call");
//       socket.off("receive-offer");
//       socket.off("receive-answer");
//       socket.off("receive-ice-candidate");
//     };
//   }, []);

//   const createPeerConnection = () => {
//     peerConnection.current = new RTCPeerConnection();
//     peerConnection.current.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("send-ice-candidate", {
//           to: remoteUserId,
//           candidate: e.candidate,
//         });
//       }
//     };
//     peerConnection.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };
//   };

//   const startCall = async () => {
//     try {
//       const screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//       });

//       createPeerConnection();
//       screenStream
//         .getTracks()
//         .forEach((track) =>
//           peerConnection.current.addTrack(track, screenStream)
//         );

//       setStream(screenStream); // <--- set stream first
//       setIsSharing(true); // <--- then render video UI

//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
//       socket.emit("send-offer", { to: remoteUserId, offer });
//     } catch (err) {
//       console.error("Error sharing screen:", err);
//     }
//   };

//   useEffect(() => {
//     if (localVideoRef.current && stream) {
//       localVideoRef.current.srcObject = stream;
//     }
//   }, [stream]);

//   const stopCall = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }

//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }

//     setStream(null);
//     setIsSharing(false);
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {!isSharing ? (
//         <button
//           onClick={startCall}
//           className="px-4 py-2 bg-blue-600 text-white rounded shadow"
//         >
//           Share Screen
//         </button>
//       ) : (
//         <div className="flex flex-col items-center gap-4">
//           <button
//             onClick={stopCall}
//             className="px-4 py-2 bg-red-600 text-white rounded shadow"
//           >
//             Stop Sharing
//           </button>
//           <div className="flex gap-4 mt-[30rem]">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-auto max-h-[80vh] border rounded-lg object-contain"
//             />
//             <video
//               ref={remoteVideoRef}
//               autoPlay
//               playsInline
//               className="w-full h-auto max-h-[80vh] border rounded-lg object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScreenShare;

// === frontend/src/components/Chat/ScreenShare/ScreenShare.js ===

// import React, { useEffect, useRef, useState } from "react";
// import socket from "./ScreenShareSocket";
// import IncomingRequest from "./IncomingRequest";
// import { useDispatch, useSelector } from "react-redux";
// import { updateSocketId } from "../../../features/userSlice";
// import { MdOutlineScreenShare } from "react-icons/md";

// const ScreenShare = () => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnection = useRef(null);

//   const [callStarted, setCallStarted] = useState(false);
//   const [incomingRequest, setIncomingRequest] = useState(null);
//   const [isSender, setIsSender] = useState(false);

//   const dispatch = useDispatch();
//   const currentUser = useSelector((state) => state.user.user); // ✅ current user
//   const remoteUser = useSelector((state) => state.chat.selectedUser); // ✅ chat recipient
//   // const user = useSelector((state) => state.user.user);

//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Socket connected with ID:", socket.id);
//       if (currentUser?.id) {
//         dispatch(updateSocketId(socket.id));
//       } else {
//         console.warn("User not logged in, cannot update socketId yet.");
//       }
//     });
//     socket.emit("register-user", {
//       userId: currentUser.id,
//       name: currentUser.name,
//       profile: currentUser.profile,
//     });
//     return () => {
//       socket.off("connect");
//     };
//   }, [currentUser, dispatch]);

//   useEffect(() => {
//     socket.on("incoming-screen-share-request", ({ from, senderInfo }) => {
//       setIncomingRequest({ from, senderInfo });
//     });

//     socket.on("screen-share-response-result", async ({ accepted }) => {
//       if (accepted) {
//         const stream = await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         });
//         createPeerConnection();
//         stream.getTracks().forEach((track) => {
//           peerConnection.current.addTrack(track, stream);
//         });
//         localVideoRef.current.srcObject = stream;

//         const offer = await peerConnection.current.createOffer();
//         await peerConnection.current.setLocalDescription(offer);
//         socket.emit("send-offer", { offer, to: remoteUser.socketId });
//         setCallStarted(true);
//         setIsSender(true);
//       } else {
//         alert("Screen share request was rejected.");
//       }
//     });

//     socket.on("receive-offer", async ({ offer, from }) => {
//       createPeerConnection();
//       await peerConnection.current.setRemoteDescription(offer);
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
//       socket.emit("send-answer", { answer, to: from });
//       setCallStarted(true);
//     });

//     socket.on("receive-answer", async ({ answer }) => {
//       await peerConnection.current.setRemoteDescription(answer);
//     });

//     socket.on("receive-ice-candidate", ({ candidate }) => {
//       peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     socket.on("screen-share-stopped", () => {
//       stopSharing();
//     });

//     return () => socket.off();
//   }, []);

//   const createPeerConnection = () => {
//     peerConnection.current = new RTCPeerConnection();

//     peerConnection.current.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("send-ice-candidate", {
//           to: remoteUser.socketId,
//           candidate: e.candidate,
//         });
//       }
//     };

//     peerConnection.current.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };
//   };

//   const handleShareScreenClick = () => {
//     if (!currentUser?.socketId || !remoteUser?.socketId) {
//       console.error("Socket ID missing for one of the users");
//       return;
//     }

//     socket.emit("request-screen-share", {
//       from: currentUser.socketId,
//       to: remoteUser.socketId,
//       senderInfo: {
//         name: currentUser.name,
//         profile: currentUser.profile,
//       },
//     });
//   };

//   const handleAccept = () => {
//     socket.emit("screen-share-response", {
//       from: currentUser.socketId,
//       to: incomingRequest.from,
//       accepted: true,
//     });
//     setIncomingRequest(null);
//   };

//   const handleReject = () => {
//     socket.emit("screen-share-response", {
//       from: currentUser.socketId,
//       to: incomingRequest.from,
//       accepted: false,
//     });
//     setIncomingRequest(null);
//   };

//   const stopSharing = () => {
//     if (localVideoRef.current?.srcObject) {
//       localVideoRef.current.srcObject
//         .getTracks()
//         .forEach((track) => track.stop());
//     }
//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }
//     setCallStarted(false);
//     setIsSender(false);
//   };

//   console.log("currentUser:", currentUser)
//   console.log("remoteUser:", remoteUser)

//   return (
//     <div>
//       {!callStarted ? (
//         <>
//           {/* <button
//           onClick={handleShareScreenClick}
//           className="bg-blue-600 text-white px-4 py-2 w-32 rounded mt-20"
//           // disabled={!currentUser?.socketId || !remoteUser?.socketId}
//         >
//           {!currentUser?.socketId || !remoteUser?.socketId
//             ? "Waiting for socket ID..."
//             : "Share Screen"}
//         </button> */}
//           <button
//             onClick={handleShareScreenClick}
//             className="text-[#005DB5] text-[1.7rem] mt-2"
//           >
//             {!currentUser?.socketId || !remoteUser?.socketId ? "Waiting for socket ID..." : "{<MdOutlineScreenShare />}"}
//           </button>
//         </>
//       ) : (
//         <div className="flex flex-col gap-4 items-center">
//           <div className="w-full max-h-[85vh]">
//             {isSender ? (
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 muted
//                 playsInline
//                 className="w-full h-auto object-contain rounded border"
//               />
//             ) : (
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-auto object-contain rounded border"
//               />
//             )}
//           </div>
//           <button
//             onClick={() => {
//               socket.emit("stop-screen-share", { to: remoteUser.socketId });
//               stopSharing();
//             }}
//             className="bg-red-600 text-white px-4 py-2 rounded"
//           >
//             Close
//           </button>
//         </div>
//       )}

//       {incomingRequest && (
//         <IncomingRequest
//           senderInfo={incomingRequest.senderInfo}
//           onAccept={handleAccept}
//           onReject={handleReject}
//         />
//       )}
//     </div>
//   );
// };

// export default ScreenShare;


import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import socket from "./ScreenShareSocket";

const ScreenShareButton = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { selectedChat } = useSelector((state) => state.chat);
  const [isSharing, setIsSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);

  const otherUser = selectedChat?.users?.find(u => u._id !== currentUser._id);

  const handleShareRequest = async () => {
    if (!currentUser || !selectedChat || !selectedChat.users || selectedChat.users.length < 2) {
      console.error("Missing data for screen sharing");
      console.log("currentUser:", currentUser);
      console.log("selectedChat:", selectedChat);
      console.log("selectedChat.users:", selectedChat?.users);
      return;
    }
  
    const otherUser = selectedChat.users.find(u => u._id !== currentUser._id);
  
    if (!otherUser) {
      console.error("Other user not found");
      return;
    }
  
    socket.emit('start-screen-share-request', {
      fromUser: currentUser,
      toUser: otherUser,
      chatId: selectedChat._id
    });
  };
  

  const stopSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    setIsSharing(false);
    socket.emit('stop-screen-share', { chatId: selectedChat._id });
  };

  socket.on('screen-share-accepted', async ({ chatId }) => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    setScreenStream(stream);
    setIsSharing(true);

    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);

    const sendFrame = () => {
      if (!isSharing) return;
      imageCapture.grabFrame().then((bitmap) => {
        // send frame to backend
        socket.emit('screen-stream', {
          chatId,
          stream: bitmap,
        });
        requestAnimationFrame(sendFrame);
      });
    };

    sendFrame();
  });

  socket.on('screen-share-rejected', () => {
    alert("Screen share request was rejected.");
  });

  return (
    <div>
      {!isSharing ? (
        <button onClick={handleShareRequest} className="bg-blue-500 px-4 py-2 text-white rounded">
          Share Screen
        </button>
      ) : (
        <button onClick={stopSharing} className="bg-red-500 px-4 py-2 text-white rounded">
          Stop Sharing
        </button>
      )}
    </div>
  );
};

export default ScreenShareButton;
