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
import { MdScheduleSend } from "react-icons/md";
import MessageInput from "./MessageInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const socket = io("http://localhost:5000");

function ChatActions({ socket }) {
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [message, setMessage] = useState("");
  const [dateTime, setDateTime] = useState("");
  const dateInputRef = useRef(null);
  const textRef = useRef();

  const [dissappearMessage, setDissappearMessage] = useState("");
  const [expiresIn, setExpiresIn] = useState(60);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(null);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!message) return; // || dateTime || scheduleTime

    setLoading(true);
    const newMsg = await dispatch(
      sendMessage({
        message,
        convo_id: activeConversation._id,
        files: [],
        token,
        ...(dateTime && { expiresAt: new Date(dateTime).toISOString() }),
        ...(scheduleTime && {
          scheduledAt: new Date(scheduleTime).toISOString(),
        }),
      })
    );
    // socket.emit("sendMessage", newMsg.payload);

    // ✅ Emit only if not scheduled
    if (!scheduleTime && !dateTime) {
      socket.emit("sendMessage", newMsg.payload);
    }

    setMessage("");
    setLoading(false);
  };

  const sendDissappearMessage = async (e) => {
    e.preventDefault();
    if (!message || !dateTime) return;

    setLoading(true);
    const expiresAt = new Date(dateTime).toISOString();
    const scheduledAt = new Date(scheduleTime).toISOString();

    const newMsg = await dispatch(
      sendMessage({
        message,
        convo_id: activeConversation._id,
        token,
        expiresAt,
        scheduledAt,
      })
    );

    // ✅ Emit only if not scheduled
    if (!dateTime) {
      socket.emit("sendMessage", {
        sender: user._id,
        receiver: activeConversation._id,
        content: message,
        expiresAt,
        scheduledAt,
      });
    }

    setMessage("");
    setDateTime("");
    setLoading(false);
  };

  const sendScheduledMessage = async () => {
    if (!message || !scheduleTime) return;
    setLoading(true);

    const now = new Date();
    if (new Date(scheduleTime) <= now) {
      alert("Please choose a future time to schedule the message.");
      setLoading(false);
      return;
    }

    const scheduledAt = new Date(scheduleTime).toISOString();

    console.log("Selected Local Schedule Time:", scheduleTime);
    console.log("Converted to UTC:", new Date(scheduleTime).toISOString());
    console.log("Current Time:", new Date().toISOString());

    const newMsg = await dispatch(
      sendMessage({
        message,
        convo_id: activeConversation._id,
        token,
        scheduledAt,
      })
    );

    // ✅ Emit only if not scheduled
    if (!scheduleTime) {
      socket.emit("scheduleMessage", {
        sender: user._id,
        receiver: activeConversation._id,
        content: message,
        scheduledAt,
      });
    }

    setMessage("");
    setScheduleTime(null);
    setShowSchedulePicker(false);
    setLoading(false);
  };

  useEffect(() => {
    socket.on("deleteMessage", (messageId) => {
      dispatch(removeMessage(messageId));
    });
    return () => socket.off("deleteMessage");
  }, [dispatch]);

  useEffect(() => {
    if (socket && activeConversation?._id) {
      socket.emit("joinRoom", activeConversation._id);
    }
  }, [socket, activeConversation]);

  return (
    <form
      onSubmit={(e) => {
        if (scheduleTime) {
          e.preventDefault();
          sendScheduledMessage();
        } else if (dateTime) {
          sendDissappearMessage(e);
        } else {
          sendMessageHandler(e);
        }
      }}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      <div className="w-full flex items-center gap-x-2">
        <ul className="flex gap-x-2">
          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showEmojiPicker}
            setShowPicker={setShowEmojiPicker}
            setShowAttachments={setShowAttachments}
          />
          <Attachments
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowEmojiPicker}
          />
        </ul>
        <Input
          message={message}
          setMessage={setMessage}
          textRef={textRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker()}
            className="rounded-full hover:bg-gray-200 dark:hover:bg-dark_bg_3"
          >
            <FaRegCalendarAlt
              className="text-gray-600 dark:text-white"
              size={25}
            />
          </button>

          <input
            type="datetime-local"
            ref={dateInputRef}
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setShowSchedulePicker(!showSchedulePicker)}
            className="rounded-full hover:bg-gray-200 dark:hover:bg-dark_bg_3"
          >
            <MdScheduleSend
              className="text-gray-600 dark:text-white"
              size={25}
            />
          </button>

          {showSchedulePicker && (
            <div className="absolute bottom-20 right-2 bg-white border rounded-xl shadow-xl z-50">
              <DatePicker
                selected={scheduleTime}
                onChange={(date) => setScheduleTime(date)}
                showTimeSelect
                timeIntervals={1}
                dateFormat="Pp"
                inline
              />
              <button
                onClick={sendScheduledMessage}
                type="button"
                className="w-full bg-blue-500 text-white py-1 rounded-b-lg text-sm hover:bg-blue-600"
              >
                Schedule
              </button>
            </div>
          )}
        </div>

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
