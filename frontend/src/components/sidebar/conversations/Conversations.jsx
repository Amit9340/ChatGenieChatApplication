import { useDispatch, useSelector } from "react-redux";
import { checkOnlineStatus, getConversationId } from "../../../utils/chat";
import Conversation from "./Conversation";
import { setActiveConversation } from "../../../features/chatSlice";

export default function Conversations({ onlineUsers, typing }) {
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.user);


  const dispatch = useDispatch();
  const handleChatSelect = (chat) => {
    dispatch(setActiveConversation(chat));
  };

  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter(
              (c) =>
                c.latestMessage ||
                c._id === activeConversation._id ||
                c.isGroup == true
            )
            .map((convo) => {
              // ✅ Skip if convo.users is missing or contains undefined users
              if (!convo.users || convo.users.some((u) => !u || !u._id)) {
                return null;
              }
              let check = checkOnlineStatus(onlineUsers, user, convo.users);
              return (
                <Conversation
                  convo={convo}
                  key={convo._id}
                  online={!convo.isGroup && check ? true : false}
                  typing={typing}
                  onSelect={() => handleChatSelect(convo)}
                />
              );
            })}
      </ul>
    </div>
  );
}
