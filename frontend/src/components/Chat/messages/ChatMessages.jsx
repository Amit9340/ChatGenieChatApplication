import { useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import Typing from "./Typing";
import FileMessage from "./files/FileMessage";
import SocketContext from "../../../context/SocketContext";
import { updateMessagesAndConversations } from "../../../features/chatSlice";

export default function ChatMessages({ typing }) {
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const endRef = useRef();

  // ✅ Socket listener for scheduled/real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      console.log("📩 Received new message via socket:", message);
      dispatch(updateMessagesAndConversations(message));
    });

    return () => socket.off("newMessage");
  }, [socket, dispatch]);

  // ⬇️ Auto scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);
  const scrollToBottom = () => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div
      className="mb-[60px] bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')]
    bg-cover bg-no-repeat
    "
    >
      {/*Container*/}
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[5%]">
        {/*Messages*/}
        {messages &&
          messages.map((message, index) => (
            <div key={index}>
              {/*Message files */}
              {message.files.length > 0
                ? message.files.map((file) => (
                    <FileMessage
                      FileMessage={file}
                      message={message}
                      key={`${message._id}_${file._id || file.name}`}
                      me={user._id === message.sender._id}
                    />
                  ))
                : null}
              {/*Message text*/}
              {message.message.length > 0 ? (
                <Message
                  message={message}
                  key={message._id}
                  me={user._id === message.sender._id}
                />
              ) : null}
            </div>
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div className="mt-2" ref={endRef}></div>
      </div>
    </div>
  );
}
