// export const getConversationId = (user, users) => {
//   return users[0]._id === user._id ? users[1]._id : users[0]._id;
// };

// ✅ Safely get the other user's ID in a one-on-one conversation
export const getConversationId = (user, users) => {
  if (!user || !Array.isArray(users)) return null;
  const otherUser = users.find((u) => u && u._id !== user._id);
  return otherUser ? otherUser._id : null;
};

// export const getConversationName = (user, users) => {
//   return users[0]._id === user._id ? users[1].name : users[0].name;
// };

// ✅ Get the other user's name
export const getConversationName = (user, users) => {
  if (!user || !Array.isArray(users)) return 'Unknown';
  const otherUser = users.find((u) => u && u._id !== user._id);
  return otherUser ? otherUser.name : 'Unknown';
};

// export const getConversationPicture = (user, users) => {
//   return users[0]._id === user._id ? users[1].picture : users[0].picture;
// };

// ✅ Get the other user's picture
export const getConversationPicture = (user, users) => {
  if (!user || !Array.isArray(users)) return '';
  const otherUser = users.find((u) => u && u._id !== user._id);
  return otherUser ? otherUser.picture : '';
};

// export const checkOnlineStatus = (onlineUsers, user, users) => {
//   let convoId = getConversationId(user, users);
//   let check = onlineUsers.find((u) => u.userId === convoId);
//   return check ? true : false;
// };

// ✅ Check if the other user is online
export const checkOnlineStatus = (onlineUsers, user, users) => {
  if (!Array.isArray(users) || users.length === 0) return false;
  const validUsers = users.filter((u) => u && u._id);
  if (validUsers.length < 2) return false;
  const convoId = getConversationId(user, validUsers);
  if (!convoId) return false;
  return onlineUsers.some((u) => u.userId === convoId);
};