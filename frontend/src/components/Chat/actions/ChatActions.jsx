import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { removeMessage, sendMessage } from "../../../features/chatSlice";
import { SendIcon } from "../../../svg";
import { Attachments } from "./attachments";
import EmojiPickerApp from "./EmojiPicker";
import Input from "./Input";
import SocketContext from "../../../context/SocketContext";
import { FaRegCalendarAlt } from "react-icons/fa";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function ChatActions({ socket }) {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState(""); // Store selected date & time
  const dateInputRef = useRef(null);
  const textRef = useRef();

  //
  const values = {
    message,
    convo_id: activeConversation._id,
    files: [],
    token,
  };
  //

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!message) return;

    setLoading(true);
    const newMsg = await dispatch(
      sendMessage({
        message,
        convo_id: activeConversation._id,
        files: [],
        token,
      })
    );
    socket.emit("sendMessage", newMsg.payload);

    setMessage(""); // Reset only after sending
    setLoading(false);
  };

  const [dissappearMessage, setDissappearMessage] = useState("");
  const [expiresIn, setExpiresIn] = useState(60); // Default: 60 seconds

  const sendDissappearMessage = async (e) => {
    e.preventDefault();
    if (!message || !dateTime) return;

    setLoading(true);
    const expiresAt = new Date(dateTime); // Ensure this is a Date object

    const newMsg = await dispatch(
      sendMessage({
        message,
        convo_id: activeConversation._id,
        token,
        expiresAt,
      })
    );

    socket.emit("sendMessage", {
      sender: user._id,
      receiver: activeConversation._id,
      content: message,
      expiresAt, // Ensure this is sent correctly
    });

    setMessage("");
    setDateTime(""); // Reset after sending
    setLoading(false);
  };

  useEffect(() => {
    socket.on("deleteMessage", (messageId) => {
      dispatch(removeMessage(messageId));
    });

    return () => socket.off("deleteMessage");
  }, [dispatch]);

  // socket.on("deleteMessage", (messageId) => {
  //   console.log("Message expired, removing:", messageId);
  //   dispatch(removeMessage(messageId));
  // });

  return (
    <form
      onSubmit={dateTime ? sendDissappearMessage : sendMessageHandler}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      {/*Container*/}
      <div className="w-full flex items-center gap-x-2">
        {/*Emojis and attachpments*/}
        <ul className="flex gap-x-2">
          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}
          />
          <Attachments
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowPicker}
          />
        </ul>
        {/*Input*/}
        <Input
          message={message}
          setMessage={setMessage}
          textRef={textRef}
          value={dissappearMessage}
          onChange={(e) => setDissappearMessage(e.target.value)}
        />

        {/* Calendar Icon */}
        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker()} // Trigger date input
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark_bg_3"
        >
          <FaRegCalendarAlt
            className="text-gray-600 dark:text-white"
            size={20}
          />
        </button>

        {/* Hidden Date & Time Picker */}
        <input
          type="datetime-local"
          ref={dateInputRef}
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="hidden"
        />

        {/*Send button*/}
        <button type="submit" className="btn">
          {status === "loading" && loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      </div>
    </form>
  );
}

const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ChatActionsWithSocket;
