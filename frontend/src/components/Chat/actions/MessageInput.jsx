import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend({ content: message, scheduledAt: scheduleTime });
    setMessage("");
    setScheduleTime(null);
  };

  return (
    <div className="flex gap-2 items-center p-2 border-t">
      <input
        className="flex-1 p-2 border rounded-xl"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="bg-gray-200 rounded-full p-2"
      >
        📅
      </button>
      {showPicker && (
        <div className="absolute bottom-20 right-2 bg-white border rounded-xl shadow-xl z-50">
          <DatePicker
            selected={scheduleTime}
            onChange={(date) => setScheduleTime(date)}
            showTimeSelect
            dateFormat="Pp"
            inline
          />
        </div>
      )}
      <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-xl">
        Send
      </button>
    </div>
  );
}