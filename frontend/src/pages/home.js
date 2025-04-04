import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import { ChatContainer, WhatsappHome } from "../components/Chat";
import { Sidebar } from "../components/sidebar";
import SocketContext from "../context/SocketContext";
import {
  getConversations,
  updateMessagesAndConversations,
} from "../features/chatSlice";
import Call from "../components/Chat/call/Call";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../utils/chat";

const callData = {
  socketId: "",
  receiveingCall: false,
  callEnded: false,
  name: "",
  picture: "",
  signal: "",
};

function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const [onlineUsers, setOnlineUsers] = useState([]);
  //call
  const [call, setCall] = useState(callData);
  const [stream, setStream] = useState();
  const [show, setShow] = useState(false);
  const { receiveingCall, callEnded, socketId } = call;
  const [callAccepted, setCallAccepted] = useState(false);
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  //typing
  const [typing, setTyping] = useState(false);
  //join user into the socket io
  useEffect(() => {
    socket.emit("join", user._id);
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    socket.on("setup socket", (id) => {
      setCall((prev) => ({ ...prev, socketId: id }));
    });
    socket.on("call user", (data) => {
      if (!data.signal) {
        console.error("Invalid signal data received:", data);
        return;
      }
      setCall({
        socketId: data.from,
        name: data.name,
        picture: data.picture,
        signal: data.signal, // The signal must be valid
        receiveingCall: true,
      });
    });
    socket.on("end call", () => {
      setShow(false);
      setCall({ callEnded: true, receiveingCall: false });
      if (myVideo.current) myVideo.current.srcObject = null;
      if (callAccepted) connectionRef?.current?.destroy();
    });
  }, []);

  const callUser = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      // myVideo.current.srcObject = mediaStream; // Ensure local video is set
      if (myVideo.current) {
        myVideo.current.srcObject = mediaStream;
    } else {
        console.error("myVideo ref is undefined");
    }

      setCall({
        ...call,
        name: getConversationName(user, activeConversation.users),
        picture: getConversationPicture(user, activeConversation.users),
      });

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: mediaStream, // Use the dynamically obtained stream
      });

      peer.on("signal", (data) => {
        console.log("Sending signal data:", data);
        if (!data || typeof data !== "object") {
          console.error("Invalid signal data:", data);
          return;
        }
        socket.emit("call user", {
          userToCall: getConversationId(user, activeConversation.users),
          signal: data,
          from: socketId,
          name: user.name,
          picture: user.picture,
        });
      });

      peer.on("stream", (stream) => {
        if (userVideo.current) {
            userVideo.current.srcObject = stream;
        } else {
            console.error("userVideo ref is undefined");
        }
    });

      // socket.off("call accepted");
      socket.on("call accepted", (signal) => {
        setCallAccepted(true);
        console.log("Received signal data:", signal);
      
        if (!signal || typeof signal !== "object" || !signal.sdp) {
          console.error("Received invalid signal data:", signal);
          return;
        }
      
        peer.signal(signal);
      });

      connectionRef.current = peer;
      setShow(true); // Show the call UI
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const answerCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);

      if (myVideo.current) {
        myVideo.current.srcObject = mediaStream;
    } else {
        console.error("myVideo ref is undefined");
    }

      // myVideo.current.srcObject = mediaStream;

      setCallAccepted(true);

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: mediaStream,
      });

      peer.on("signal", (data) => {
        socket.emit("answer call", { signal: data, to: call.socketId });
      });

      peer.on("stream", (stream) => {
        if (userVideo.current) {
            userVideo.current.srcObject = stream;
        } else {
            console.error("userVideo ref is undefined");
        }
    });

    if (!call.signal || typeof call.signal !== "object") {
      console.error("Received invalid signal data:", call.signal);
      return;
  }

      peer.signal(call.signal);
      connectionRef.current = peer;
      setShow(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const endCall = () => {
    setShow(false);
    setCall({ callEnded: true, receiveingCall: false });
    if (myVideo.current) myVideo.current.srcObject = null;
    if (userVideo.current) userVideo.current.srcObject = null;
    socket.emit("end call", call.socketId);
    // connectionRef?.current?.destroy();
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }
  };

  const setupMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      myVideo.current.srcObject = mediaStream;
      return mediaStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      return null;
    }
  };

  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);

  useEffect(() => {
    socket.on("receive message", (message) => {
      dispatch(updateMessagesAndConversations(message));
    });
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop typing", () => setTyping(false));
  }, []);

  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        <div className="container h-screen flex py-[19px]">
          <Sidebar onlineUsers={onlineUsers} typing={typing} />
          {activeConversation._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              callUser={callUser}
              typing={typing}
            />
          ) : (
            <WhatsappHome />
          )}
        </div>
      </div>
      <div className={(show || call.signal) && !call.callEnded ? "" : "hidden"}>
        <Call
          call={call}
          setCall={setCall}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          stream={stream}
          answerCall={answerCall}
          show={show}
          endCall={endCall}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
        />
      </div>
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default HomeWithSocket;
